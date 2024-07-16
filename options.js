var svbt=document.getElementById("save");
var sts=document.getElementById("stats");

function setHeights(sc){
			[...sc.children].forEach((k)=>{
				k.style.height='min-content';
				k.style.height=k.scrollHeight+3;
		});
}

function create_sct(){
		let sc=document.createElement('section');
		sc.style.cssText='display: inline !important;';
		sc.className='site_sets';
		sc.innerHTML='<textarea placeholder="URL" style="box-shadow: 0 0 0px 1px black; border-width: 0px; width:32.5%;"></textarea></textarea><textarea style="box-shadow: black 0px 0px 0px 1px;border-width: 0px;width: 32.5%;margin-left: 0.16%;"></textarea><br><br>';
		return sc;
}

let sc1=create_sct();
sts.insertAdjacentElement('beforebegin', sc1);
setHeights(sc1);


let sct=[...document.querySelectorAll('SECTION.site_sets')];
function forceNewSct(sci){
		let sc=create_sct();
		sci.insertAdjacentElement('afterend', sc);
		setHeights(sc);
		sc.oninput= function(event){
			let scs=event.target.parentElement;
			setHeights(scs);
			let tst=[...document.querySelectorAll('SECTION.site_sets')];
			if (scs===tst[tst.length-1]){
			chk(scs,0);
			}else{
			chk(scs,1);
			}
		}
		return sc;
}

let chk=function(sci,init){
	let u=sci.children[0];
	let f=sci.children[1];
let sct2=[...document.querySelectorAll('SECTION.site_sets')];
	if (((u.value!="" && f.value!="")&&(sct2.length==1))||((u.value!="" && f.value!="")&&(init!=1)&&(sct2.length>1))){
		forceNewSct(sci);
	}else if((u.value=="" && f.value=="")&&(sct2.length>1)&&(init!=2)){
		sci.remove();
	}
}

sct[0].oninput= function(event){
	chk(sct[0],1);
	setHeights(sct[0]);
}

function removeEls(d, array){
	var newArray = [];
	for (let i = 0; i < array.length; i++)
	{
		if (array[i] !== d)
		{
			newArray.push(array[i]);
		}
	}
	return newArray;
}

function unDef(v,d,r){
	if(typeof r==='undefined'){
		return (typeof v !=='undefined')?v:d;
	}else{
		return (typeof v !=='undefined')?r:d;
	}
}

function setAddrCSS(vs,ix){
	let arr=JSON.parse(vs);
	for(let i=0, len=arr.length; i<len; i++){
		let sss=[...document.querySelectorAll('SECTION.site_sets')];
		let ss=sss[i];
		if(i>sss.length-1){
			ss=forceNewSct(sss[sss.length-1]);
		}
		ss.children[ix].value=arr[i];
		setHeights(ss);
	}
	let sss=[...document.querySelectorAll('SECTION.site_sets')];
	sss[sss.length-1].dispatchEvent(new Event('input'));
}

var saver =function(){
		let scts=[...document.querySelectorAll('SECTION.site_sets')];
		let addrs=[];
		let fcns=[];
	let validate = true;	
	for(let k=0, len=scts.length; k<len; k++){

		let lstChk = scts[k].children[0].value.trim();
		let fcn = scts[k].children[1].value.trim();
		
		if(lstChk!=='' && fcn!==''){
				addrs.push(lstChk);
				fcns.push(fcn);
		}

}
	if (validate)
	{
			chrome.storage.local.clear(function() {
		chrome.storage.local.set(
		{
			addrs_list: JSON.stringify(addrs),
			fcn_list: JSON.stringify(fcns)
		}, function()
		{
			sts.innerText = 'Options saved.';
			setTimeout(function()
			{
				sts.innerText = '';
			}, 1250);
		});
			});
			
}else{
	alert('Blacklist textarea contents invalid!');
}
	 }
 
function restore_options()
{
	if(typeof chrome.storage==='undefined'){
		restore_options();
	}else{
	chrome.storage.local.get(null, function(items)
	{
		if (Object.keys(items).length != 0)
		{
			//console.log(items);
			setAddrCSS(unDef(items.addrs_list,'[]'),0);
			setAddrCSS(unDef(items.fcn_list,'[]'),1);
			svbt.onclick = () => saver();
		}
		else
		{
			save_options();
		}
	});
	}
}

function save_options()
{
		chrome.storage.local.clear(function() {
	chrome.storage.local.set(
	{
		addrs_list: '[]',
		fcn_list: '[]'
	}, function(){
		restore_options();
	});
		});
}

restore_options();