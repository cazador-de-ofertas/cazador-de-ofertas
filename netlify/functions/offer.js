const {getStore}=require('@netlify/blobs');
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
exports.handler=async e=>{
 const slug=(e.path||'').split('/').filter(Boolean).pop(),s=getStore('offers'),o=await s.get(slug,{type:'json'});
 if(!o)return {statusCode:404,headers:{'content-type':'text/html'},body:'Oferta no encontrada'};
 const bot=/Twitterbot|facebookexternalhit|Facebot|LinkedInBot|Slackbot/i.test(e.headers['user-agent']||'');
 if(bot){const html=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(o.title)}</title><meta property="og:title" content="${esc(o.title)}"><meta property="og:description" content="${esc((o.discount+' '+o.price).trim())}"><meta property="og:image" content="${esc(o.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(o.title)}"><meta name="twitter:description" content="${esc((o.discount+' '+o.price).trim())}"><meta name="twitter:image" content="${esc(o.image)}"></head><body>Oferta</body></html>`;return {statusCode:200,headers:{'content-type':'text/html'},body:html}}
 return {statusCode:302,headers:{Location:o.url},body:''};
};
