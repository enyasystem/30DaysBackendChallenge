async function postJson(url, body){
  const res = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  return res.json().catch(()=>({ status: res.status }));
}

document.getElementById('create').addEventListener('click', async ()=>{
  const amount = Number(document.getElementById('amount').value);
  const currency = document.getElementById('currency').value;
  const res = await postJson('/payment-intents', { amount, currency });
  document.getElementById('createResult').textContent = JSON.stringify(res, null, 2);
  if (res && res.id) document.getElementById('piId').value = res.id;
});

document.getElementById('charge').addEventListener('click', async ()=>{
  const paymentIntentId = document.getElementById('piId').value;
  const webhookUrl = document.getElementById('webhookUrl').value;
  const succeed = document.getElementById('succeed').checked;
  const res = await postJson('/provider/charge', { paymentIntentId, webhookUrl, succeed });
  document.getElementById('chargeResult').textContent = JSON.stringify(res, null, 2);
});

document.getElementById('check').addEventListener('click', async ()=>{
  const id = document.getElementById('checkId').value || document.getElementById('piId').value;
  if (!id) return alert('provide an id');
  const res = await fetch('/payment-intents/' + id).then(r => r.json());
  document.getElementById('checkResult').textContent = JSON.stringify(res, null, 2);
});
