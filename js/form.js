/* =============================================================================
 * form.js - Smart Order Form (Component 21 / CRO §6 §7 §8 §9 §15 §16 §24)
 * Logic:
 *   1 gói = 109000
 *   combo 2 gói hoặc 4 gói = 99000/gói
 *   discount = qty*109000 - total
 *   ship = total >= 250000 ? 0 : 30000
 * =============================================================================*/
(function (global) {
  'use strict';

  var U = global.SADU && global.SADU.utils;
  var CFG = global.SADU_CONFIG || {};

  function calcOrder(qty) {
    var unit = CFG.UNIT_PRICE || 109000;
    var dealMinQty = CFG.DEAL_MIN_QTY || 2;
    var dealUnit = CFG.DEAL_UNIT_PRICE || 99000;
    var listTotal = qty * unit;
    var comboTotal = qty >= dealMinQty ? qty * dealUnit : listTotal;
    var discount = listTotal - comboTotal;
    var shipping = comboTotal >= (CFG.FREE_SHIP_THRESHOLD || 250000)
      ? 0
      : (CFG.SHIPPING_FEE || 30000);

    return {
      qty: qty,
      productTotal: listTotal,
      comboTotal: comboTotal,
      discount: discount,
      shipping: shipping,
      checkoutTotal: comboTotal + shipping
    };
  }

  function fadeUpdate(el, text) {
    if (!el) return;
    el.classList.add('updating');
    setTimeout(function () {
      el.textContent = text;
      el.classList.remove('updating');
    }, 160);
  }

  var RULES = {
    name: function (v) { return v.trim().length >= 2 || 'Vui lòng nhập họ tên.'; },
    phone: function (v) { return U.isValidVNPhone(v) || 'Vui lòng nhập số điện thoại hợp lệ.'; },
    address: function (v) { return v.trim().length >= 5 || 'Vui lòng nhập địa chỉ nhận hàng.'; }
  };

  function validateField(id, value) {
    var rule = RULES[id];
    if (!rule) return true;

    var result = rule(value);
    var field = document.getElementById('field-' + id);
    var errEl = document.getElementById('err-' + id);
    var input = field && field.querySelector('input,textarea');

    if (result === true) {
      if (field) field.classList.remove('is-error', 'is-invalid');
      if (input) input.classList.remove('is-error');
      if (errEl) errEl.textContent = '';
    } else {
      if (field) field.classList.add('is-invalid');
      if (input) input.classList.add('is-error');
      if (errEl) errEl.textContent = result;
    }

    return result === true;
  }

  function isFieldValid(id, value) {
    var rule = RULES[id];
    if (!rule) return true;
    return rule(value) === true;
  }

  function init() {
    var form = document.getElementById('order-form-el');
    var qtyInp = document.getElementById('qty-input');
    if (!form || !qtyInp) return;

    var btnEl = document.getElementById('btn-submit');
    var btnText = document.getElementById('btn-submit-text');
    var errBox = document.getElementById('form-server-error');
    var formCard = form.closest('.orderform__form-card');

    var elQty = document.getElementById('sum-qty');
    var elSubtotal = document.getElementById('sum-subtotal');
    var elDiscount = document.getElementById('sum-discount');
    var elShip = document.getElementById('sum-ship');
    var elGrand = document.getElementById('sum-grand');
    var elCombo = document.getElementById('sum-combo-badge');
    var elDiscRow = document.getElementById('sum-discount-row');
    var elSaving = document.getElementById('sum-saving');
    var elShipFeedback = document.getElementById('ship-feedback');
    var elSummaryComboTag = document.getElementById('summary-combo-tag');
    var elSummaryComboTitle = document.getElementById('summary-combo-title');
    var elSummaryComboDesc = document.getElementById('summary-combo-desc');
    var elSummaryTotalNote = document.getElementById('summary-total-note');
    var comboOptions = Array.prototype.slice.call(document.querySelectorAll('[data-combo-option]'));

    var submitting = false;

    function renderComboChoice(qty) {
      comboOptions.forEach(function (btn) {
        var selected = parseInt(btn.getAttribute('data-qty'), 10) === qty;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-checked', selected ? 'true' : 'false');
      });

      if (qty === 4) {
        fadeUpdate(elSummaryComboTag, 'Combo 4 gói');
        fadeUpdate(elSummaryComboTitle, '396.000đ · miễn phí vận chuyển');
        fadeUpdate(elSummaryComboDesc, 'Phù hợp để dùng đều đặn, tiết kiệm 40.000đ so với mua lẻ.');
        fadeUpdate(elSummaryTotalNote, 'Combo 4 gói đang là lựa chọn tối ưu vì được miễn phí vận chuyển.');
      } else {
        fadeUpdate(elSummaryComboTag, 'Combo 2 gói');
        fadeUpdate(elSummaryComboTitle, '198.000đ · tiết kiệm 20.000đ');
        fadeUpdate(elSummaryComboDesc, 'Gọn để dùng thử, vẫn được tính 99.000đ/gói.');
        fadeUpdate(elSummaryTotalNote, 'Combo 2 gói phù hợp khi bạn muốn dùng thử trước.');
      }
    }

    function syncSmartCtaState() {
      if (!formCard) return;
      var ready = isFieldValid('name', document.getElementById('inp-name') ? document.getElementById('inp-name').value : '')
        && isFieldValid('phone', document.getElementById('inp-phone') ? document.getElementById('inp-phone').value : '')
        && isFieldValid('address', document.getElementById('inp-address') ? document.getElementById('inp-address').value : '')
        && getQty() >= (CFG.QTY_MIN || 1);

      formCard.classList.toggle('is-ready', !!ready);
      if (btnEl) btnEl.disabled = submitting ? true : false;
    }

    function renderSummary(r) {
      fadeUpdate(elQty, r.qty + ' gói');
      fadeUpdate(elSubtotal, U.formatVND(r.productTotal));

      if (elDiscRow) elDiscRow.hidden = false;
      fadeUpdate(elDiscount, r.discount > 0 ? '−' + U.formatVND(r.discount) : '0đ');
      if (elCombo) elCombo.hidden = !(r.discount > 0);

      if (r.shipping === 0) {
        fadeUpdate(elShip, 'Miễn phí');
        if (elShip) elShip.className = 'summary-value summary-ship-free';
        if (elShipFeedback) {
          elShipFeedback.hidden = false;
          fadeUpdate(elShipFeedback, 'Bạn đã được miễn phí vận chuyển.');
        }
      } else {
        fadeUpdate(elShip, U.formatVND(r.shipping));
        if (elShip) elShip.className = 'summary-value';
        if (elShipFeedback) {
          elShipFeedback.hidden = false;
          fadeUpdate(elShipFeedback, 'Phí vận chuyển ' + U.formatVND(r.shipping) + '.');
        }
      }

      fadeUpdate(elGrand, U.formatVND(r.checkoutTotal));

      if (elSaving) {
        if (r.discount > 0) {
          elSaving.hidden = false;
          fadeUpdate(elSaving, 'Bạn đang tiết kiệm ' + U.formatVND(r.discount));
        } else {
          elSaving.hidden = true;
        }
      }
      renderComboChoice(r.qty);

      syncSmartCtaState();
    }

    function getQty() {
      return Math.max(
        CFG.QTY_MIN || 1,
        Math.min(CFG.QTY_MAX || 99, parseInt(qtyInp.value, 10) || 1)
      );
    }

    function setQty(n) {
      n = n === 4 ? 4 : 2;
      qtyInp.value = n;
      renderSummary(calcOrder(n));
    }

    setQty(CFG.QTY_DEFAULT || 4);

    comboOptions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setQty(parseInt(btn.getAttribute('data-qty'), 10) || 4);
      });
    });
    qtyInp.addEventListener('change', function () { setQty(getQty()); });
    qtyInp.addEventListener('input', function () {
      var n = parseInt(qtyInp.value, 10);
      if (!isNaN(n) && n > 0) renderSummary(calcOrder(n));
      syncSmartCtaState();
    });

    ['name', 'phone', 'address'].forEach(function (id) {
      var el = document.getElementById('inp-' + id);
      if (el) el.addEventListener('blur', function () {
        validateField(id, el.value);
        syncSmartCtaState();
      });
      if (el) el.addEventListener('input', function () {
        var field = document.getElementById('field-' + id);
        if (field && field.classList.contains('is-invalid')) validateField(id, el.value);
        syncSmartCtaState();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;

      var nameEl = document.getElementById('inp-name');
      var phoneEl = document.getElementById('inp-phone');
      var addressEl = document.getElementById('inp-address');

      var ok = validateField('name', nameEl ? nameEl.value : '')
        & validateField('phone', phoneEl ? phoneEl.value : '')
        & validateField('address', addressEl ? addressEl.value : '');
      if (!ok) {
        var first = form.querySelector('.is-error');
        if (first) first.focus();
        return;
      }

      var r = calcOrder(getQty());
      var normalizedPhone = U.normalizePhone(phoneEl ? phoneEl.value : '');
      var payload = {
        name: nameEl ? nameEl.value.trim() : '',
        phone: normalizedPhone,
        address: addressEl ? addressEl.value.trim() : '',
        quantity: r.qty,
        productTotal: r.productTotal,
        discount: r.discount,
        shipping: r.shipping,
        checkoutTotal: r.checkoutTotal,
        qty: r.qty,
        subtotal: r.comboTotal,
        ship: r.shipping,
        grand: r.checkoutTotal,
        source: 'Landing Page',
        timestamp: new Date().toISOString()
      };

      U.track('submit_form', { grand: r.checkoutTotal, qty: r.qty });

      submitting = true;
      syncSmartCtaState();
      if (btnEl) btnEl.disabled = true;
      if (btnText) btnText.textContent = 'Đang gửi đơn hàng...';

      var url = CFG.GAS_WEBAPP_URL;
      var firePixelSuccess = function () {
        try {
          if (global.SADUPixel && typeof global.SADUPixel.purchase === 'function') {
            global.SADUPixel.purchase(r.checkoutTotal);
          }
        } catch (e1) {}
        try {
          if (global.SADUPixel && typeof global.SADUPixel.lead === 'function') {
            global.SADUPixel.lead();
          }
        } catch (e2) {}
      };
      var handleSuccess = function (orderId) {
        U.track('submit_success', { grand: r.checkoutTotal, orderId: orderId || '' });
        showSuccess();
      };

      if (!url) {
        setTimeout(function () { handleSuccess('LOCAL-TEST'); }, 900);
        return;
      }

      var fd = new FormData();
      Object.keys(payload).forEach(function (k) { fd.append(k, payload[k]); });

      fetch(url, { method: 'POST', body: fd })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (!result.success) {
            throw new Error(result.message || 'Đặt hàng thất bại.');
          }
          firePixelSuccess();
          handleSuccess(result.data && result.data.orderId);
        })
        .catch(function (err) {
          console.error(err);
          submitting = false;
          syncSmartCtaState();
          if (btnEl) btnEl.disabled = false;
          if (btnText) btnText.textContent = 'ĐẶT HÀNG NGAY';
          if (errBox) {
            errBox.hidden = false;
            errBox.textContent = 'Chưa gửi được đơn hàng. Vui lòng gọi hotline hoặc thử lại sau ít phút.';
          }
        });
    });

    function showSuccess() {
      var card = form.closest('.orderform__form-card');
      if (!card) return;
      var suc = card.querySelector('.form-success');
      form.style.display = 'none';
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.setAttribute('aria-disabled', 'true');
      }
      if (btnText) btnText.textContent = 'ĐÃ GỬI';
      if (suc) suc.classList.add('is-visible');
    }

    syncSmartCtaState();
  }

  global.SADU = global.SADU || {};
  global.SADU.form = { init: init, calcOrder: calcOrder };
})(window);
