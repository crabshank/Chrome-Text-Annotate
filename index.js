send('getStatus',true);

let mkp=document.getElementById('markPage');
let mkps=document.getElementById('markPageSave');
let svtx=document.getElementById('saveText');
let txtar=document.getElementById('txta');
let spt=document.getElementById('setupPatt');

window.onclick=(e)=>{
	t=e.target;
	if(t===mkp || t===mkps || t===svtx){
		send([t.id,txtar.value]);
		window.close();
	}else if(t===spt){ //Add to options
		send([t.id,null]);
		window.close();
	}
};

function setHeight(el){
				el.style.height='min-content';
				el.style.height=(el.scrollHeight)+'px';
}

txtar.oninput=(e)=>{
	setHeight(e.target);
};

function send(message,notClose) {

    let params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
		let tid=tabs[0].id;
      let msg = {
        message: message,
		tabId: tid,
        title:tabs[0].title
      };
      chrome.tabs.sendMessage(tid, msg);
      if(notClose!==true){
        window.close();
      }
    }

}
 
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let m=message.message;
    if(m==='marked'){
		mkp.style.display='none';
		mkps.style.display='none';
		mkpsTxt.style.display='none';
		txtar.style.display='none';
		spt.style.display='';
	}
});
