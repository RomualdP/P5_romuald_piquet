let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderid");

document.getElementById("orderId").innerText = orderId