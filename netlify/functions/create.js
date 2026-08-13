const {getStore}=require('@netlify/blobs');
const out=(status,body)=>({statusCode:status,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
exports.handler=async e=>{
 if(e.httpMethod!=='POST')return out(405,{error:'Method not allowed'});
 if(!process.env.ADMIN_KEY||e.headers['x-admin-key']!==process.env.ADMIN_KEY)return out(401,{error:'Clave incorrecta'});
 let b;try{b=JSON.parse(e.body||'{}')}catch{return out(400,{error:'Datos inválidos'})}
 if(!/^https?:\/\//i.test(b.url)||!b.title||!/^https:\/\//i.test(b.image))return out(400,{error:'Faltan datos obligatorios'});
 let slug=String(b.slug||Math.random().toString(36).slice(2,9)).toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
 const s=getStore('offers');if(await s.get(slug,{type:'json'}))return out(409,{error:'Ese código ya existe'});
 await s.setJSON(slug,{url:b.url,title:b.title,price:b.price||'',discount:b.discount||'',oldPrice:b.oldPrice||'',image:b.image,description:b.description||''});
 return out(200,{slug});
};
