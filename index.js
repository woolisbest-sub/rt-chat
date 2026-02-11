const http=require("http");
const WebSocket=require("ws");

const PORT=process.env.PORT||3000;

const page=`<!DOCTYPE html><html><body>
<input id=n placeholder=name>
<input id=m placeholder=message>
<button onclick=s()>send</button>
<pre id=l></pre>
<script>
const w=new WebSocket((location.protocol==="https:"?"wss://":"ws://")+location.host);
w.onmessage=e=>l.textContent+=e.data+"\\n";
function s(){w.send(JSON.stringify({name:n.value,msg:m.value}));m.value="";}
</script>
</body></html>`;

const server=http.createServer((req,res)=>{
res.writeHead(200,{"Content-Type":"text/html"});
res.end(page);
});

const wss=new WebSocket.Server({server});

wss.on("connection",ws=>{
ws.on("message",msg=>{
wss.clients.forEach(c=>{
if(c.readyState===1)c.send(msg.toString());
});
});
});

server.listen(PORT,"0.0.0.0");
