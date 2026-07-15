# Thinkific checkout + purchase tracking

The site tracks everything up to `checkout_started` (the click to Thinkific).
Events on Thinkific's own pages — `checkout_viewed` and `purchase_completed` —
must fire from Thinkific, because the checkout runs on bbcode.thinkific.com.

Both snippets post to `https://www.basketballbiomechanics.com/api/track`,
which stores them in the same `bb_events` table the /analytics dashboard
reads. Attribution (UTMs + session id) is carried over automatically: every
CTA click appends `bb_sid`, `bb_vid`, and the UTM params to the enroll URL,
and snippet 1 saves them on Thinkific's domain.

## 1. Site footer code (fires checkout_viewed, saves attribution)

Thinkific Admin → Settings → Code & analytics → **Site footer code**:

```html
<script>
(function () {
  var API = 'https://www.basketballbiomechanics.com/api/track';
  var KEYS = ['bb_sid', 'bb_vid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  function qs(n) {
    var m = new RegExp('[?&]' + n + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }
  KEYS.forEach(function (k) {
    var v = qs(k);
    if (v) { try { localStorage.setItem('bbx_' + k, v); } catch (e) {} }
  });
  function g(k) { try { return localStorage.getItem('bbx_' + k) || ''; } catch (e) { return ''; } }
  window.bbSend = function (ev, extra) {
    var p = {
      event: ev,
      page: location.pathname,
      session_id: g('bb_sid'),
      visitor_id: g('bb_vid'),
      utm_source: g('utm_source'),
      utm_medium: g('utm_medium'),
      utm_campaign: g('utm_campaign'),
      utm_content: g('utm_content'),
      referrer: document.referrer,
      landing_page: 'thinkific'
    };
    for (var k in (extra || {})) p[k] = extra[k];
    try {
      navigator.sendBeacon(API, new Blob([JSON.stringify(p)], { type: 'application/json' }));
    } catch (e) {}
  };
  if (/\/enroll\/|\/cart|\/checkout|\/order/.test(location.pathname)) {
    window.bbSend('checkout_viewed', { product: 'Shooting Calibration Masterclass', price: 297 });
  }
})();
</script>
```

## 2. Order tracking code (fires purchase_completed)

Thinkific Admin → Settings → Code & analytics → **Order tracking code**
(runs once on the purchase confirmation page; Liquid variables are available):

```html
<script>
(function () {
  if (typeof window.bbSend === 'function') {
    window.bbSend('purchase_completed', {
      product: '{{ order.product_name | escape }}' || 'Shooting Calibration Masterclass',
      revenue: parseFloat('{{ order.amount_dollars }}') || 297,
      price: parseFloat('{{ order.amount_dollars }}') || 297
    });
  }
})();
</script>
```

If the Liquid variables render empty on your Thinkific plan, the fallbacks
(297 / product name) still record a correct purchase for the masterclass.

## Notes

- `checkout_abandoned` is computed on the dashboard (sessions with
  `checkout_started` and no `purchase_completed`) — no snippet needed.
- After pasting both snippets, run a test purchase (or a 100%-off coupon
  order) and confirm the purchase shows at
  `https://www.basketballbiomechanics.com/analytics?pin=YOUR_CRM_PIN`.
