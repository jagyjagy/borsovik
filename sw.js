// Boršovík Service Worker v1.0
// Lokální notifikace — funguje bez externího push serveru

const CACHE='borsovik-v1';

self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});

// Přijme zprávu z appky s daty o pobytu
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SCHEDULE_NOTIF'){
    const{title,body,tag,timestamp}=e.data;
    const delay=timestamp-Date.now();
    if(delay>0&&delay<48*3600*1000){
      setTimeout(()=>{
        self.registration.showNotification(title,{
          body,
          tag,
          icon:'icon.png',
          badge:'icon.png',
          vibrate:[200,100,200],
          requireInteraction:false,
        });
      },delay);
    }
  }
  if(e.data&&e.data.type==='CANCEL_NOTIF'){
    self.registration.getNotifications({tag:e.data.tag}).then(ns=>ns.forEach(n=>n.close()));
  }
});

// Klik na notifikaci → otevře appku
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cs=>{
    for(const c of cs){if(c.url.includes('borsovik')&&'focus' in c)return c.focus();}
    if(clients.openWindow)return clients.openWindow('./borsovik.html');
  }));
});
