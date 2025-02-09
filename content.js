var chg = window.location.href;
var addrs=[];
var fcns=[];
var urlMatch=[];
var firstDone=false;
var isMarked=false;
var markStyl='mark.no_hl[indexnumber]{background-color:unset !important; color:unset !important;}';
var tb_id=null;
var tb_ttl=document.title;
var textAnnotate;
var docEvts={};
let addedNodes_toProc=[];

function hashReset(){
    addrs=[];
    fcns=[];
    urlMatch=[];
    firstDone=false;
    elRemover(textAnnotate.sct);
    textAnnotate=new_textAnnotate();
    let styls=[...document.head.getElementsByTagName('STYLE')].find(s=>{return s.innerHTML.includes(markStyl);});
    if(typeof(styls)!=='undefined'){
        elRemover(styls);
    }
    start_up();
}

function sortByArrCols(arr, colsArr, dir){
    arr.sort(sortFunction);
		function sortFunction(a, b) {
			for(let i = 0; i < arr.length; i++){
					if(a[colsArr[i]]>b[colsArr[i]]){
						return dir[i]*-1;
					}else if(a[colsArr[i]]<b[colsArr[i]]){
						return dir[i]*1;
					}else if(i==arr.length-1){
					return 0;
				}
			} 
	}
}

function getParent(el,elementsOnly,doc_head_body){
	if(!!el && typeof el!=='undefined'){
		let out=null;
		let curr=el;
		let end=false;
		
		while(!end){
			if(!!curr.parentNode && typeof curr.parentNode!=='undefined'){
				out=curr.parentNode;
				curr=out;
				end=(elementsOnly && out.nodeType!=1)?false:true;
			}else if(!!curr.parentElement && typeof curr.parentElement!=='undefined'){
					out=curr.parentElement;
					end=true;
					curr=out;
			}else if(!!curr.host && typeof curr.host!=='undefined'){
					out=curr.host;
					end=(elementsOnly && out.nodeType!=1)?false:true;
					curr=out;
			}else{
				out=null;
				end=true;
			}
		}
		
		if(out!==null){
			if(!doc_head_body){
				if(out.nodeName==='BODY' || out.nodeName==='HEAD' || out.nodeName==='HTML'){
					out=null;
				}
			}
		}
		
		return out;
	}else{
		return null;
	}
}

function getAncestors(el, elementsOnly, elToHTML, doc_head_body, notInShadow){
	let curr=el;
	let ancestors=[el];
	let outAncestors=[];
	let end=false;
	
	while(!end){
		let p=getParent(curr,elementsOnly,doc_head_body);
		if(p!==null){
			if(elToHTML){
				ancestors.push(p);
			}else{
				ancestors.unshift(p)
			}
			curr=p;
		}else{
			end=true;
		}
	}
	if(notInShadow){
		if(elToHTML){
			for(let i=ancestors.length-1; i>=0; i--){
				outAncestors.unshift(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=0;
				}
			}
		}else{
			for(let i=0, len=ancestors.length; i<len; i++){
				outAncestors.push(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=len-1;
				}
			}
		}
	}else{
		outAncestors=ancestors;
	}
	return outAncestors;
}

function getScrollY(anc){
	let ty = [		window?.pageYOffset,
											window?.scrollY,
											document?.documentElement?.scrollTop,
											document?.body?.parentNode?.scrollTop,
											document?.body?.scrollTop,
											document?.head?.scrollTop,
											0
										];
		for(let k=0, len_k=anc.length; k<len_k; k++){
			ty.push(anc[k]?.scrollTop);
		}
	ty=ty.filter( (p)=>{return p>=0} );
										
	return Math.max(...ty);
}

/*function getScrollX(anc){
	let tx = [		window?.pageXOffset,
											window?.scrollX,
											document?.documentElement?.scrollLeft,
											document?.body?.parentNode?.scrollLeft,
											document?.body?.scrollLeft,
											document?.head?.scrollLeft,
											0
										];
		for(let k=0, len_k=anc.length; k<len_k; k++){
			tx.push(anc[k]?.scrollLeft);
		}
	tx=tx.filter( (p)=>{return p>=0} );
										
	return Math.max(...tx);
}*/

function savePage(filename, htmlText) {
  let htmlContent = typeof(htmlText)==='string' ? htmlText : document.documentElement.outerHTML  ;
  let a = document.createElement('a');
  a.href ='data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

//Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net> - LZ-based compression algorithm, version 1.4.5
var LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();

let empty_JSON_arr=LZString.compressToEncodedURIComponent('[]');

async function updateAnnotations(){
	return new Promise(function(resolve) {
		chrome.storage.local.get(null, function(items) {
							let setObj=items;
							let setObjct=true;

							if(!!items.addrs_list && typeof  items.addrs_list!=='undefined'){
								addrs=JSON.parse(items.addrs_list);
							}else{
								setObjct=false;
							}
							
							if(!!items.fcn_list && typeof  items.fcn_list!=='undefined'){
								fcns=JSON.parse(LZString.decompressFromEncodedURIComponent(items.fcn_list));
							}else{
								setObjct=false;
							}
								if(setObjct){
									 let an={};
									an.textRGB=textAnnotate.textRGB;
									an.annotations=textAnnotate.annotations;
									an.options=textAnnotate.options;
									an.markText= textAnnotate.selector===null ? textAnnotate.markText: null;
									an.selector=textAnnotate.selector;
									let ann=JSON.stringify(an)/*.replaceAll('[{','[\n\t{').replaceAll('},{','},\n\t{').replaceAll('}]','}\n]')+';'*/;
									let wlh=window.location.href;
									inAddrs=addrs.includes(wlh)?true:false;
									if(!urlMatch[0] || !inAddrs){
										let i=addrs.length;
										addrs.push(wlh);
										fcns.push(ann);
										if(!urlMatch[0]){
											urlMatch=[true,wlh,fcns[i],i];
										}
									}else{
										fcns[ urlMatch[3] ]=ann;
									}
									setObj.fcn_list=LZString.compressToEncodedURIComponent(JSON.stringify(fcns));
									setObj.addrs_list=JSON.stringify(addrs);
									chrome.storage.local.set(setObj, function() {
													resolve();
									});
								}
		});
	});
}

function new_textAnnotate(){
    let ta={}
    ta.annotations=[]; //Store annotations
ta.lastAnnotations=[]; //Store last annotations
ta.options=[]; //Store names to choose from
ta.markText='';

ta.perChar=function(els){ //Create per-character mark tags
	let allTextNodeParentEls=[];
	let elsArr=Array.isArray(els) ? els : [els];
	let cnt=0;
	let defCol;
	for(let j=0, len_j=elsArr.length; j<len_j; j++){
		let tmp_allTextNodeParentEls=[];
		let el=elsArr[j];
		let n=getMatchingNodesShadow_order(el, '#text', true, false)/*.filter((t)=>{return t.parentElement.tagName!=='TITLE' ;})*/;
		for(let k=0, len_k=n.length; k<len_k; k++){
			let diffCol=false;
			let nk=n[k];
			let pp=nk.parentElement;
			if(!allTextNodeParentEls.includes(pp)){
				let chs=getMatchingNodesShadow_order(pp, false, true,false);
				if(!chs.includes(ta.ifrm) && !chs.includes(ta.sct) && !chs.includes(ta.scr)){
					let wcs=window.getComputedStyle(pp);
					let txc=wcs.color;
					let txcAtt=' '; 
					if(cnt===0){
						defCol=txc;
						txcAtt=` textCol="${txc}" `;
					}
					let dtc=nk.textContent;
					if(txc!==defCol){
						txcAtt=` textCol="${txc}" `;
						diffCol=true;
					}
					nk.textContent=`<mark${txcAtt}indexnumber="${cnt}" class="no_hl">`+dtc[0]+'</mark>';
					ta.markText+=dtc[0];
					nk.indexNumber=cnt;
					
					if(!tmp_allTextNodeParentEls.includes(pp)){
						tmp_allTextNodeParentEls.push(pp);
					}
					let lastNode=nk;
					cnt++;
					for(let i=1, len_i=dtc.length; i<len_i; i++){
						txcAtt= diffCol===true ? ` textCol="${txc}" ` : ' ';
						nt = document.createTextNode(`<mark${txcAtt}indexnumber="${cnt}" class="no_hl">`+dtc[i]+'</mark>');
						ta.markText+=dtc[i];
						insertAfter(nt, lastNode);
						nt.indexNumber=cnt;
						cnt++;
						lastNode=nt;
					}
				}
		}
		}
		for(let k=0, len_k=tmp_allTextNodeParentEls.length; k<len_k; k++){
			allTextNodeParentEls.push(tmp_allTextNodeParentEls[k]);
		}
	}
	
	let styl='<style>'+markStyl+'</style>'
	document.head.insertAdjacentHTML('afterbegin',styl);
	for(let k=0, len_k=allTextNodeParentEls.length; k<len_k; k++){
		let pk=allTextNodeParentEls[k];
		pk.innerHTML=pk.innerHTML.replaceAll('&lt;mark textCol="','<mark textCol="').replaceAll('&lt;mark indexnumber="','<mark indexnumber="').replaceAll('" class="no_hl"&gt;','" class="no_hl">').replaceAll('&lt;/mark&gt;','</mark>');
	}
	console.log('Per-character mark tags created!');
}

ta.nameSelection=function(names, altText,hexRGB,ix){ //Create annotation for selected node range; 'names' and altText arguments are a string or array of strings
	if(ix!==null){
		ixt=parseInt(ix);
		let ax=ta.annotations[ixt];
		let stx2=getMatchingNodesShadow_order(document,'mark[indexnumber]',false,false).filter(m=>{let n=parseInt(m.getAttribute('indexnumber')); return ax.nodeIndexes.includes(n); });
		let srgb=(typeof(hexRGB)==='string')?hexRGB:'#FFFF00';
		for(let i=0, len_i=stx2.length; i<len_i; i++){
			stx2[i].style.backgroundColor=srgb;
			let txc=stx2[i].getAttribute('textCol');
			stx2[i].style.color=txc!==null ? txc : stx2[0].getAttribute('textCol');
		}
			let an={};
			if(typeof(names)==='string'){
				ax.types=[names];
				
				if(typeof(altText)!=='undefined'){
					ax.altText=altText;
				}
			}else{ //array
				ax.types=[];
				if(typeof(altText)!=='undefined'){
					ax.altText=altText;
				}
				for(let i=0, len_i=names.length; i<len_i; i++){
					ax.types.push(names[i]);
				}
			}
			ax.hexRGB=srgb;
            for(let k=0, len_k=ax.types.length; k<len_k; k++){
			if(!ta.options.includes(ax.ypes[k])){
				ta.options.push(ax.types[k]);
			}
		}
			ta.annotations[ixt]=ax; // [ [ ALL INDEX NUMBERS HERE! ], ... ]
			updateAnnotations();
	}else{
		let sel=window.getSelection();
        let selNodes=[];
        let idc=ta.ifrm_document;
        let selTxt=idc.getElementById('selText');
        let stx=JSON.parse(selTxt.getAttribute('selmarks'));
        let stx2=getMatchingNodesShadow_order(document,'mark.no_hl[indexnumber]',false,false);
		let stx_doc=[];
		let firstTCol;
		stx_doc.length=stx2.length;
		let srgb=(typeof(hexRGB)==='string')?hexRGB:'#FFFF00';
		for(let i=0, len_i=stx2.length; i<len_i; i++){
			let s2i=stx2[i];
			let n=parseInt(s2i.getAttribute('indexnumber'));
            if(typeof(stx_doc[n])==='undefined'){
                stx_doc[n]=[s2i];
            }else{
                stx_doc[n].push(s2i);
            }
		}
		for(let i=0, len_i=stx.length; i<len_i; i++){
			let stxi=stx[i];
            selNodes.push(stxi);
			if(typeof (stx_doc[stxi]) !=='undefined'){
				stx_doc[stxi].forEach(m=>{
					m.className='';
					m.style.backgroundColor=srgb;
					let txc=stx_doc[ selNodes[0] ][0].getAttribute('textcol');
					txc=txc!==null ? txc : ( typeof(stx_doc[0])==='undefined' ? '#000000' : stx_doc[0][0].getAttribute('textcol'));		
					m.style.color=txc;
					if(i===0){
						firstTCol=txc;
					}
				});
			}
		}
		
		if(selNodes.length>0){
			let an={};
			if(typeof(names)==='string'){
				an={text:selTxt.innerText,types:[names],nodeIndexes:selNodes};
				if(typeof(altText)!=='undefined'){
					an.altText=altText;
				}
			}else{ //array
				an={text:selTxt.innerText,types:[]};
				if(typeof(altText)!=='undefined'){
					an.altText=altText;
				}
				for(let i=0, len_i=names.length; i<len_i; i++){
					an.types.push(names[i]);
				}
				an.nodeIndexes=selNodes;
			}
            an.textCol=firstTCol;
			an.hexRGB=srgb;
            for(let k=0, len_k=an.types.length; k<len_k; k++){
                if(!ta.options.includes(an.types[k])){
                    ta.options.push(an.types[k]);
                }
            }
			ta.annotations.push(an); // [ [ ALL INDEX NUMBERS HERE! ], ... ]
			updateAnnotations();
		}else{
			console.error('No selected text!');
		}
	}
}

ta.getAnnotationsByType=function(typs){ // 'typs' is a string or array of strings
	if(typeof(typs)==='string'){
		let f=ta.annotations.filter((n)=>{return n.types.includes(typs);});
		console.log(f);
	}else{
		let out=[];
		let outIxs=[];
		for(let i=0, len_i=typs.length; i<len_i; i++){
			let f=ta.annotations.filter((n)=>{return n.types.includes(typs[i]);});
			for(let k=0, len_k=f.length; k<len_k; k++){
				let n=ta.annotations.indexOf(f[k]);
				if(!outIxs.includes(n)){
					outIxs.push(n);
					out.push(f[k]);
				}
				
			}
		}
		console.log(out)
	}
}

ta.logAnnotations=function(){ //Export annotations as text array
    let an={};
    an.annotations=ta.annotations;
    an.markText=ta.markText;
	let ann=JSON.stringify(an).replaceAll('[{','[\n\t{').replaceAll('},{','},\n\t{').replaceAll('}]','}\n]')+';';
	copy(ann);
	console.log(ann);
}

ta.logOptions=function(){ //Export annotations as text array
	let opt=JSON.stringify(ta.options);
	copy(opt);
	console.log(opt);
}

ta.logMatchingAnnotations=function(event){ //Pointer event; Log matching annotations
	let a=ta.annotations;
	let t=event.target;
	let mtc=[];
	let msl='mark[indexnumber]';
	if(t.matches(msl)){
		let f=a.filter((n)=>{
			return n.nodeIndexes.includes(parseInt(t.getAttribute('indexnumber')));
		});
		for(let k=0, len_k=f.length; k<len_k; k++){
			let x=a.indexOf(f[k]);
			if(!mtc.includes(x)){
				mtc.push(x);
			}
		}
	}else{
		let chd=getMatchingNodesShadow_order(t, msl, false, false);
		let mtc=[];
		for(let i=0, len_i=chd.length; i<len_i; i++){
				let ci=chd[i];
				let f=a.filter((n)=>{
					return n.nodeIndexes.includes(ci.indexNumber);
				});
				for(let k=0, len_k=f.length; k<len_k; k++){
					let x=a.indexOf(f[k]);
					if(!mtc.includes(x)){
						mtc.push(x);
					}
				}
		}
	}
		
		let mtcl=mtc.length;
		if(mtcl>0){
			let argm=[];
			if( JSON.stringify(ta.lastAnnotations)!==JSON.stringify(mtc) ){
				ta.lastAnnotations=mtc;
				console.group('Matching annotations:');
					for(let i=0; i<mtcl; i++){
						let ix=mtc[i];
						let b=a[ix];
						b.index=ix;
						console.log(b);
						argm.push(b);
					}
				console.groupEnd();
			}else{
				for(let i=0; i<mtcl; i++){
					let ix=mtc[i];
					let b=a[ix];
					b.index=ix;
					argm.push(b);
				}
			}
			//setup iframe
			ta.sct.style.setProperty( 'display', 'inline-block','important' );
			ta.populateFrameHover(argm);
		}
	
}


ta.hlMarks=function(el){ //Highlight marks after ta.annotations has already been assigned
	let mks=getMatchingNodesShadow_order( ( (el===null || typeof(el)==='undefined' )? document : el ) ,`mark[indexnumber]`,false,false);
	for(let i=0, len_i=ta.annotations.length; i<len_i; i++){
		let ai=ta.annotations[i];
		for(let k=0, len_k=ai.nodeIndexes.length; k<len_k; k++){
			let xk=ai.nodeIndexes[k];
			let ix=mks.findIndex( (m)=>{ return parseInt(m.getAttribute('indexnumber'))===xk; } );
			if(ix>=0){
				let msx=mks[ix];
				msx.className='';
				msx.style.backgroundColor=ai.hexRGB;
				let txc=msx.getAttribute('textcol');
				msx.style.color=txc!==null ? txc : mks[0].getAttribute('textcol');
			}
		}
	}
}

ta.importString=function(arrString,el){ //Import annotations as array string; el is the element within which to search for annotatable mark tags, if undefined or null, defaults to document
	let an=JSON.parse(arrString);
    ta.annotations=an.annotations;
    ta.markText=an.markText;
	ta.hlMarks(el);
	updateAnnotations();
}

ta.importOptionsString=function(arrString){ //Import options as array string
	ta.options=JSON.parse(arrString);
}

ta.import=function(arr,el){  //Import annotations as array; el is the element within which to search for annotatable mark tags, if undefined or null, defaults to document
	ta.annotations=arr;
	ta.hlMarks(el);
	updateAnnotations();
}

ta.importOptions=function(arr){  //Import options as array
	ta.options=arr;
	updateAnnotations();
}

ta.remove=function(n){  //Remove annotations as array; n is number or array of numbers
	let arr=(typeof(n)==='number')?[n]:n;
	let ixs=[];
	let out=[];
	for(let k=0, len_k=arr.length; k<len_k; k++){
		let nk=arr[k];
		let ank=ta.annotations[nk];
		let mk=getMatchingNodesShadow_order(document,`mark[indexnumber]`,false,false);
		let mks=[];
		mks.length=mk.length;
		for(let i=0, len_i=mks.length; i<len_i; i++){
			let mki=mk[i];
			let ix=parseInt(mki.getAttribute('indexnumber'));
			if(typeof	(mks[ix])==='undefined'){
				mks[ix]=[mki];
			}else{
				mks[ix].push(mki);
			}
		}

		for(let j=0, len_j=ank.nodeIndexes.length; j<len_j; j++){
			let nj=ank.nodeIndexes[j];
			mks[nj].forEach(m=>{
				m.className='no_hl';
			});
		}
		ixs.push(nk);
	}
	let optsUpd=[];
	for(let k=0, len_k=ta.annotations.length; k<len_k; k++){
		if(!ixs.includes(k)){
			let tak=ta.annotations[k];
			out.push(tak);
			for(let j=0, len_j=tak.types.length; j<len_j; j++){
				let tj=tak.types[j];
				if(optsUpd.includes(tj)===false){
					optsUpd.push(tj);
				}
			}
		}
	}
	let outp=[];
	for(let k=0, len_k=ta.options.length; k<len_k; k++){
		let pk=ta.options[k];
		if(optsUpd.includes(pk)===true){
			outp.push(pk);
		}
	}
	ta.options=outp;
	ta.annotations=out;
	updateAnnotations();
}

ta.addOptions=function(opt){	//'opt' is a string or array of strings
		let opts=(typeof(opts)==='string')?[opt]:opt;
		for(let i=0, len_i=opts.length; i<len_i; i++){
			if(!ta.options.includes(opts[i])){
				ta.options.push(opts[i]);
			}
		}
		updateAnnotations();
}

ta.removeOptions=function(opt){	//'opt' is a string or array of strings
		let opts=(typeof(opts)==='string')?[opt]:opt;
		for(let i=0, len_i=opts.length; i<len_i; i++){
			ta.options=ta.options.filter((p)=>{return p!==opts[i];})
		}
		updateAnnotations();
}

ta.findMarks=function(pat,plain,case_insensitive){	//search for marked text
  
										
    if(isMarked && (ta.markText==='' || ta.markText===null ) ){
          let stx=getMatchingNodesShadow_order(document,'div#textAnnotate_markText',false,false);
		  if(stx.length>0){
			  ta.markText=stx[0].textContent;
		  }
    }
    let str=ta.markText;
    let out=[];
    if(plain===true){
		let strRaw=str;
		let patRaw=pat;
		if(case_insensitive===true){
			str=str.toLocaleLowerCase();
			pat=pat.toLocaleLowerCase();
		}
        let a=str.indexOf(pat);
        let pl=pat.length;
        while(a!==-1){
			let ed=a+pl-1;
			let tx=pat;
			if(case_insensitive){
				tx='';
				 for(let i=a; i<=ed; i++){
					 tx+=strRaw[i];
				 }
			}
            out.push({text:tx, markRange:[a,ed]});
            a=str.indexOf(pat,a+pl);
        }
    }else{ //regex
        let a=[...str.matchAll(pat)];
        for(let i=0, len_i=a.length; i<len_i; i++){
            let ai=a[i];
            let ai0=ai[0];
            let aix=ai.index;
            out.push({text:ai0, markRange:[aix,aix+ai0.length-1]});
        }
    }
    return out;
}

ta.searchSelect=function(mks,hexRGB,types,altText){	//search for marked text and select; mks=ta.findMarks(pat,plain,case_insensitive);

        let stx2=getMatchingNodesShadow_order(document,'mark[indexnumber]',false,false);
		let stx_doc=[];
		let firstTCol;
		stx_doc.length=stx2.length;
		let srgb=(typeof(hexRGB)==='string')?hexRGB:'#FFFF00';
		for(let i=0, len_i=stx2.length; i<len_i; i++){
			let s2i=stx2[i];
			let n=parseInt(s2i.getAttribute('indexnumber'));
            if(typeof(stx_doc[n])==='undefined'){
                stx_doc[n]=[s2i];
            }else{
                stx_doc[n].push(s2i);
            }
		}

    for(let i=0, len_i=mks.length; i<len_i; i++){
        let mi=mks[i];
        let mitx=mi.text;
        let selNodes=[];
        for(let j=mi.markRange[0], jb=mi.markRange[1]; j<=jb; j++){
            selNodes.push(j);
        }
        let an={};
			if(typeof(types)==='string'){
				an={text:mitx,types:[types],nodeIndexes:selNodes};
				if(!!altText && typeof(altText)!=='undefined'){
					an.altText=altText;
				}
			}else{ //array
				an={text:mitx,types:[]};
				if(typeof(altText)!=='undefined'){
					an.altText=altText;
				}
                if(!!types && typeof(types)!=='undefined'){
				for(let i=0, len_i=types.length; i<len_i; i++){
					an.types.push(types[i]);
				}
            }
				an.nodeIndexes=selNodes;
			}

		
		for(let i=0, len_i=selNodes.length; i<len_i; i++){
			let stxi=selNodes[i];
			if(typeof (stx_doc[stxi]) !=='undefined'){
				stx_doc[stxi].forEach(m=>{
					m.className='';
					m.style.backgroundColor=srgb;
					let txc=stx_doc[ selNodes[0] ][0].getAttribute('textcol');
					txc=txc!==null ? txc : ( typeof(stx_doc[0])==='undefined' ? '#000000' : stx_doc[0][0].getAttribute('textcol'));
					m.style.color=txc;
					if(i===0){
						firstTCol=txc;
					}
				});
			}
		}

            an.textCol=firstTCol;
			an.hexRGB=srgb;
            for(let k=0, len_k=an.types.length; k<len_k; k++){
                if(!ta.options.includes(an.types[k])){
                    ta.options.push(an.types[k]);
                }
            }
			ta.annotations.push(an); // [ [ ALL INDEX NUMBERS HERE! ], ... ]
    }
	updateAnnotations();
}

ta.jump=function(i){  //Jump to annotation by index
		if(!(i>=0 && i<ta.annotations.length)){
			console.error(`Argument must be between 0 and ${ta.annotations.length-1}!`);
			return;
		}
		let ix=ta.annotations[i].nodeIndexes[0];
		let el=getMatchingNodesShadow_order(document,'mark[indexnumber]',false,false).find((m)=>{let n=parseInt(m.getAttribute('indexnumber')); return n===ix; });
		let anc=getAncestors(el,true,true,false,true);
		 for(let i=0, len_i=anc.length; i<len_i; i++){
			let sy=getScrollY(anc);
			anc[i].scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
			let sy2=getScrollY(anc);
			if(sy!==sy2){
				break;
			}
		}
}


ta.populateFrameHover=(argm)=>{ //Setup iFrame

			let mxs={types:0,alt:0};
			let tr2='';
			for(let i=0,len=argm.length; i<len;i++){
				let ai=argm[i];
				let mt=ai.types.length;
				mxs.types=(mt>mxs.types)?mt:mxs.types;
				let typa=typeof(ai.altText);
				let ma=0;
				let typAlt=false;
				if(ai.altText!==null && typa!=='undefined'){
					if(typa==='string'){
						ma=1;
						typAlt=true;
					}else{
						ma=ai.altText.length;
					}		
				}
				mxs.alt=(ma>mxs.alt)?ma:mxs.alt;
				tr2+=`<tr><td><button id="editBtn" ix="${ai.index}" func="editAnn" style="width: -webkit-fill-available;margin-bottom: 0.3ch;">Edit</button><br><button style="width: -webkit-fill-available" id="delBtn" ix="${ai.index}" func="remAnn">Delete</button></td><td>[${ai.index}]</td>`;
				tr2+=`<td style="text-align:left !important;font-family: monospace;font-size: 2.3ch;width: 12ch; background-color: ${ai.hexRGB}; color: ${ai.textCol}">${ai.text}</td>`;
				for(let k=0; k<mt; k++){
					tr2+=`<td>${ai.types[k]}</td>`;
				}
				for(let k=0; k<ma; k++){
					tr2+=`<td>${	(	(typAlt)?ai.altText:ai.altText[k]	)	}</td>`;
				}
				tr2+='</tr>';
			}
			
			let tr=`<tr><th></th><th>index</th><th>text</th>`;
			let thst='';
			let thsa='';
			if(mxs.types>0){
				thst=`<th colspan="${mxs.types}">types</th>`;
			}
			if(mxs.alt>0){
				thsa=`<th colspan="${mxs.alt}">altText</th>`;
			}
			tr+=thst+thsa+'</tr>'; //first row 
			
			
			ta.ifrm_document.body.innerHTML=`<table>${tr}${tr2}</table>`;
			let delBtn=ta.ifrm_document.body.querySelector('#delBtn');
			//delBtn.ta=ta;
			let editBtn=ta.ifrm_document.body.querySelector('#editBtn');
			//editBtn.ta=ta;
			let sh=ta.ifrm_document.body.scrollHeight;
			ta.ifrm.style.setProperty( 'width', `${ta.ifrm_document.body.scrollWidth}px`, 'important' );
			ta.ifrm.style.setProperty( 'height', `${sh}px`, 'important' );
			ta.sct.style.setProperty( 'height', `${sh}px`, 'important' );
			
		};

		ta.populateFrame=(ix,chkTypes,isPatt,pattData)=>{ //Setup iFrame
			let tyx,isx,isax,gsel,mks,mksj;
			let typPD_undef=typeof(pattData)==='undefined'?true:false;
			let sel= isPatt===true && typPD_undef===false ? pattData[0] : '' ;
			if(isPatt!==true){ //pattern-based
				tyx=typeof(ix);
				isx= tyx!=='undefined' && ix!==null ? true : false;
				isax= isx && tyx!=='string' && ix.length>0 && typeof(ix[1])==='string' ? true :false;
				gsel=window.getSelection();
				//sel='';
				mks=[];
				mksj='';
				if(isax){
						sel=ix[0];
						mksj=ix[1];
						mks=JSON.parse(mksj[1]);
				}else if(!isx){
						sel=gsel.toString();
						let s=gsel.getRangeAt(0).cloneContents();
						let stx=getMatchingNodesShadow_order(s,'mark.no_hl[indexnumber]',false,false);
						for(let i=0, len_i=stx.length; i<len_i; i++){
							let mn=stx[i].getAttribute('indexnumber');
							if(mn!==null){
								mks.push(parseInt(mn));
							}
						}
						mksj=JSON.stringify(mks);
				}
				
			}

			
			let colrs=[];
			let cols='';
			let presentCols=Array.from( new Set(ta.annotations.map((a)=>{return a.hexRGB;})));
			for (let i=0, len=presentCols.length; i<len;i++){
				let s=`<label for="c${i}" class="col pre"> <input class="col" type="checkbox" func="checkCols" id="c${i}"><div class="col" style="background-color: ${presentCols[i]} !important;"></div></input>${presentCols[i].toLocaleUpperCase()}</label>`;
				colrs.push(s);
			}
			cols=colrs.join('\n');
			
			let optns=[];
			let opts='';
			for (let i=0, len=ta.options.length; i<len;i++){
				let opi='opt'+i;
				let s=`<label for="${opi}">
				<input type="checkbox" id="${opi}" class="types"></input>${ta.options[i]}</label>`;
				optns.push(s);
			}
			opts=optns.join('\n');

			ta.ifrm_document.body.innerHTML=`
		<section style="display: flex; flex-direction: row; place-items: flex-start;"> <div id="selText" style="border:buttonface; border-width: 0.28ch; border-style: groove; padding: 0.2ch;" title="${ isPatt===true ? 'Enter search pattern (regex, without bounding forward slashes/plaintext)' : ''}"${ isPatt===true ? ' contenteditable' : ' selmarks="'+mksj+'"'}>${sel}</div>${ isPatt===true ? '<section style="display: flex; flex-direction:column;"><section style="display: flex;flex-direction: row;"><input type="checkbox" title="Regex, by default" id="plainSearch" style="place-self: center"></input><span style="text-wrap: nowrap;align-self: center;" title="Regex, by default">Plain text</span></section><section style="display: flex;flex-direction: row;"><input type="checkbox" id="caseInsens" style="place-self: center"></input><span style="text-wrap: nowrap;align-self: center;">Case-insensitive</span></section><section style="display: flex;flex-direction: row;"><input type="checkbox" id="unic" style="place-self: center"><span style="text-wrap: nowrap;align-self: center;">Unicode regex</span></section></section>' : ''}<button id="hideFrame" style="float:right;width: 4.3ch;color: red;background: black;border: 1px buttonface outset;margin-left: 0.02ch;">❌</button></section>
		<section style="width: max-content;">
			<section id="nameForm">
			<form>
		  <div class="multiselect">
			<div class="selectBox" func="showCheckboxes" args="false">
			  <select>
				<option>Select types</option>
			  </select>
			  <div class="overSelect"></div>
			</div>
			<div id="checkboxes" class="expanded">
			  ${opts}
			</div>
		  </div>
		  <section id="altTexts" style="margin-top: 0.3ch;">
			<span>Alt text:</span><br>
				<section style="margin-bottom: 0.7ch;" class="altTextInstance">	<textarea func="setHeights" class="altText"></textarea>	<button class="newAlt" style="filter: hue-rotate(212deg) saturate(10); width: 4.3ch;">➕</button>	<button id="${ isPatt===true ? 'addOpt_patt' : 'addOpt'}">Add as type</button></section>
		  </section>
		</form>


		</section>

		<section>
			<form>
		  <div class="multiselect">
			<div class="selectBox" func="showCheckboxes" args="true">
			  <select>
				<option>Select RGB</option>
			  </select>
			  <div class="overSelect"></div>
			</div>
			<div id="checkboxesCol" class="expanded">
			  <label for="c1" class="col"> <input class="col" type="checkbox" func="checkCols" id="c1"><input class="col" type="color" style="width: 4.808ch !important; margin-right: 0.48ch !important; height: auto !important; background-color: #ffff00 !important; border: #ffff00 !important;" func="customCol" id="vis" value="#ffff00"></input>Custom</label>
			  ${cols}
			</div>
		  </div>
		</form>
		</section>
		${isPatt===true ? '' : '<section style="display: flex; flex-direction: row;">' }<button style="white-space: nowrap;" id="${ isPatt===true ? 'pattSearch' : 'nameSel'}">${ isPatt===true ? 'Search pattern!' : 'Name selection!'}</button>${isPatt===true ? '' : '	<button style="white-space: nowrap; right: 0;position: absolute;" id="genPatSearch">Search for text</button></section>' }
		</section>`;
		
		let idc=ta.ifrm_document;

		if(isPatt!==true && isx && !isax){
			let ax=ta.annotations[ix];
			let nameSel=idc.getElementById('nameSel');
			nameSel.setAttribute('ix',ix);
			let selText=idc.getElementById('selText');
			selText.innerText=ax.text;
			let altTxts=[...idc.getElementsByClassName('altText')];
			if (typeof(ax.altText)==='string'){
				altTxts[0].value=ax.altText;
			}else if(ax.altText!==null){
				for(let i=0, len=ax.altText.length; i<len; i++){
					altTxts=[...idc.getElementsByClassName('altText')];
					let ati=altTxts[i];
					ati.value=ax.altText[i];
					if(i<len-1){
						ati.nextElementSibling.click();
					}
				}
			}
			let chks=[...idc.querySelectorAll('#checkboxes input[type="checkbox"]')];
			for(let i=0, len_i=ax.types.length; i<len_i; i++){
				let ti=ax.types[i];
				for(let k=0, len_k=chks.length; k<len_k; k++){
					let ck=chks[k];
					let p=ck.parentElement;
					if(p.innerText===ti){
						ck.checked=true;
					}
				}
			}
			
			chks=[...idc.querySelectorAll('#checkboxesCol input[type="checkbox"]')]; //RGB
			for(let k=0, len_k=chks.length; k<len_k; k++){
				let ck=chks[k];
				if(ck.parentElement.innerText===ax.hexRGB){
					ck.checked=true;
					break;
				}
			}
		}

		if(typeof(chkTypes)!=='undefined'){
				let chks=[...idc.querySelectorAll('#checkboxes input[type="checkbox"]')];
			for(let i=0, len_i=chkTypes[0].length; i<len_i; i++){
				let ti=chkTypes[0][i];
				for(let k=0, len_k=chks.length; k<len_k; k++){
					let ck=chks[k];
					let p=ck.parentElement;
					if(p.innerText===ti){
						ck.checked=true;
					}
				}
			}
			
			chks=[...idc.querySelectorAll('#checkboxesCol input[type="checkbox"]')]; //RGB
			let fnd=false;
			for(let i=0, len_i=chkTypes[1].length; i<len_i; i++){
				let ti=chkTypes[1][i];
				for(let k=0, len_k=chks.length; k<len_k; k++){
					let ck=chks[k];
					let p=ck.parentElement;
					if(p.innerText===ti){
						ck.checked=true;
						fnd=true;
						break;
					}
				}
			}
			
			if(fnd===false){
				let cl=chks[0].nextElementSibling;
				cl.value=typeof (chkTypes[1][0])!=='undefined'?chkTypes[1][0]:'#ffff00';
				cl.dispatchEvent(new Event('input'));
				chks[0].checked=true;
			}
		}
		
			if(isPatt===true){
				ta.sct.style.setProperty( 'display', 'inline-block','important' );
				if(typPD_undef===false){					
					idc.getElementById('plainSearch').checked=pattData[1];
					idc.getElementById('caseInsens').checked=pattData[2];
					idc.getElementById('unic').checked=pattData[3];
				}
			}

		}

return ta;
}

textAnnotate=new_textAnnotate();

function insertAfter(newNode, existingNode) {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}


function doMark(s, markOnly, noMark){
    let sel=[];
	if(s!==false && typeof(s)!=='undefined' && s.trim()!==''){
        sel=getMatchingNodesShadow_order(document,s,false,false);
    }else{
        let wsel=window.getSelection();
        let rng=document.createRange();
        rng.selectNodeContents(document.documentElement);
        wsel.removeAllRanges();
        wsel.addRange(rng);
        sel=getMatchingNodesShadow_order(document, '#text', true, false).filter(t=>{
            return wsel.containsNode(t);
        });
        wsel.removeAllRanges();
    }
	textAnnotate.selector= markOnly===true || isMarked===true  ? null : s ; 
	if(sel===null && s!==false){
		alert('Invalid CSS selector!');
		return;
	}
	//iframe
	if(markOnly!==true){
		//iframe
		textAnnotate.sct=document.createElement('section');
		document.body.insertAdjacentElement('beforeend',textAnnotate.sct);
		textAnnotate.sct.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
		textAnnotate.sct.style.setProperty( 'display', 'none','important' );
		textAnnotate.sct.style.setProperty( 'top', '0px', 'important' );
		textAnnotate.sct.style.setProperty( 'right', '0px', 'important' );
		textAnnotate.sct.style.setProperty( 'width', 'max-content', 'important' );
		textAnnotate.sct.style.setProperty( 'position', 'fixed', 'important' );
		textAnnotate.sct.style.setProperty( 'margin', 0, 'important' );
		textAnnotate.sct.style.setProperty( 'border', 0, 'important' );
		textAnnotate.sct.style.setProperty( 'padding', 0, 'important' );

		textAnnotate.ifrm=document.createElement('iframe');
		textAnnotate.sct.insertAdjacentElement('afterbegin',textAnnotate.ifrm);
		textAnnotate.ifrm_document=textAnnotate.ifrm.contentWindow.document;

			let robs = new ResizeObserver(entries => {
			for (let entry of entries) {
				let cr = entry.contentRect;
				if(entry.target===textAnnotate.ifrm_document.body){
					textAnnotate.ifrm.style.setProperty( 'width', `${entry.target.scrollWidth}px`, 'important' );
					textAnnotate.ifrm.style.setProperty( 'height', `${cr.height}px`, 'important' );
					textAnnotate.sct.style.setProperty( 'height', `${cr.height}px`, 'important' );
				}
			}
		});

		robs.observe(textAnnotate.ifrm_document.body);
		
		textAnnotate.ifrm_document.oninput=function(e){
			let t=e.target;
			let f=t.getAttribute('func');
			if(t.id==='plainSearch'){
                let u=t.ownerDocument.getElementById('unic').parentElement;
                if(t.checked){
                  u.style.visibility='hidden';
                }else{
                  u.style.visibility='visible';
                }
            }else if(f==='setHeights'){
				t.style.height='min-content';
				t.style.height=t.scrollHeight+3;
			}else if(f==='checkCols'){
				let cols=[...textAnnotate.ifrm_document.querySelectorAll('input.col[type="checkbox"]:checked')];        
				if(cols.length===2){
					let ixn=cols.findIndex((c)=>{return c!==t});
					cols[ixn].checked=false;
					t.checked=true;
				}
			}else if(f==='customCol'){
				t.style.backgroundColor=t.value;
				t.style.border=t.value;
				let cn=t.parentElement.childNodes;
				if(cn[cn.length-1].textContent==='Custom'){
					let cols=[...textAnnotate.ifrm_document.querySelectorAll('input.col[type="checkbox"]:checked')];
					cols.forEach(c=>{
						c.checked=false;
					});
					t.previousElementSibling.checked=true;
				}
				cn[cn.length-1].textContent=t.value.toLocaleUpperCase();
			}
		}

		let expanded = true;
		textAnnotate.ifrm_document.onclick=function(e){
			let t=e.target;
			let f=t.getAttribute('func');
			if(t.tagName!=='INPUT' && t.tagName!=='LABEL'){
				e.preventDefault();
			}
			e.stopPropagation();
			
			if(f==='editAnn'){
				textAnnotate.populateFrame(parseInt(t.getAttribute('ix')));
			}else if(f==='remAnn'){
				textAnnotate.remove(parseInt(t.getAttribute('ix')));
				textAnnotate.sct.style.setProperty( 'display', 'none','important' );
			}else if(f==='showCheckboxes'){
				let checkboxes = document.getElementById(  ( col ? "checkboxesCol" : "checkboxes" ) );
				if (!expanded) {
					checkboxes.style.display = "block";
					checkboxes.classList.add('expanded');
					expanded = true;
				} else {
					checkboxes.style.display = "none";
					checkboxes.classList.remove('expanded');
					expanded = false;
				}
			}else if(t.id==='pattSearch'){
				try{
					let idc=textAnnotate.ifrm_document;
					let patEl=idc.getElementById('selText');
					let isPlain= idc.getElementById('plainSearch').checked ? true : false ;
					let isCaseInsens= idc.getElementById('caseInsens').checked ? true : false ;
					let rx= idc.getElementById('unic').checked ? 'u' : '' ;
					let p= isPlain ? patEl.innerText : new RegExp(patEl.innerText, (isCaseInsens ? rx+"gi" : rx+"g"));
					let mks=textAnnotate.findMarks(p,isPlain,isCaseInsens);
					let cols=null;
					let chkd=[...textAnnotate.ifrm_document.querySelectorAll('input.types[type="checkbox"]:checked')].map((c)=>{return c.parentElement.innerText;});
					try{ 
						cols=[[...textAnnotate.ifrm_document.querySelectorAll('input.col[type="checkbox"]:checked')][0]].map((c)=>{let cpar=c.parentElement; let cpc=cpar.childNodes; return cpc[cpc.length-1].textContent;})[0];
						cols=(cols==="Custom")?null:cols;
					}catch(e){;}
					let altTexts=[...textAnnotate.ifrm_document.querySelectorAll('textarea.altText')].map((b)=>{return b.value;}).filter((b)=>{return b!==''});
					let altTx;
					if(altTexts===null || altTexts.length===0){
							altTx=null;
					}else{
							altTx=(altTexts.length===1)?altTexts[0]:altTexts;
					}
					textAnnotate.searchSelect(mks,cols,chkd,altTx);
				}finally{
					textAnnotate.sct.style.setProperty( 'display', 'none','important' );
				}
			}else if(t.id==='genPatSearch'){
                textAnnotate.populateFrame(undefined,undefined,true);
        }else if(t.id==='nameSel'){
				let cols=null;
				let chkd=[...textAnnotate.ifrm_document.querySelectorAll('input.types[type="checkbox"]:checked')].map((c)=>{return c.parentElement.innerText;});
				try{ 
					cols=[[...textAnnotate.ifrm_document.querySelectorAll('input.col[type="checkbox"]:checked')][0]].map((c)=>{let cpar=c.parentElement; let cpc=cpar.childNodes; return cpc[cpc.length-1].textContent;})[0];
					cols=(cols==="Custom")?null:cols;
				}catch(e){;}
				let altTexts=[...textAnnotate.ifrm_document.querySelectorAll('textarea.altText')].map((b)=>{return b.value;}).filter((b)=>{return b!==''});
				let ix= t.getAttribute('ix');
				if(altTexts===null || altTexts.length===0){
						textAnnotate.nameSelection(chkd,null,cols,ix);
				}else{
						textAnnotate.nameSelection(chkd, (	(altTexts.length===1)?altTexts[0]:altTexts	),cols,ix );
				}
				console.log(textAnnotate.annotations);
				textAnnotate.sct.style.setProperty( 'display', 'none','important' );
			}else if(t.id==='hideFrame'){
				textAnnotate.sct.style.setProperty( 'display', 'none','important' );
			}else if(t.className==='deleteAlt'){
				let altTextsInst=t.parentElement;
				let allAltTexts=altTextsInst.parentElement;
				elRemover(altTextsInst);
				let scts=[...allAltTexts.getElementsByClassName('altTextInstance')];
				if(scts.length>0){
					let sctLast=scts.at(-1);
					let hasPlus=(sctLast.getElementsByClassName('newAlt').length===0)?false:true;
					if(hasPlus===false){
						sctLast.outerHTML=(scts.length===1)?`<section style="margin-bottom: 0.7ch;" class="altTextInstance">	<textarea func="setHeights" class="altText">${sctLast.firstElementChild.value}</textarea>	<button class="newAlt" style="filter: hue-rotate(212deg) saturate(10); width: 4.3ch;">➕</button><button id="addOpt" style="margin-left: 0.35ch;">Add as type</button></section>`:`<section class="altTextInstance">	<textarea func="setHeights" class="altText">${sctLast.firstElementChild.value}</textarea>	<button class="newAlt" style="filter: hue-rotate(212deg) saturate(10); width: 4.3ch;">➕</button> <button class="deleteAlt" style=" width: 4.3ch;">🗙</button>	</section>`;
					}
				}
			}else if(t.className==='newAlt'){
				let altTexts=t.parentElement.parentElement;
				altTexts.insertAdjacentHTML('beforeend','<section class="altTextInstance">	<textarea func="setHeights" class="altText"></textarea>	<button class="newAlt" style="filter: hue-rotate(212deg) saturate(10); width: 4.3ch;">➕</button> <button class="deleteAlt" style=" width: 4.3ch;">🗙</button>	</section>');
				let scts=[...altTexts.getElementsByClassName('altTextInstance')];
				for(let i=0, len=scts.length-1;i<len;i++){
					elRemover(scts[i].getElementsByClassName('newAlt')[0]);
				}
			}else if(t.id==='addOpt' || t.id==='addOpt_patt'){
				let opt=t.parentElement.firstElementChild.value;
					if(!textAnnotate.options.includes(opt)){
						textAnnotate.options.push(opt);
						let slt=textAnnotate.ifrm_document.getElementById('selText');
						if(t.id==='addOpt_patt'){
							textAnnotate.populateFrame([slt.innerText,slt.getAttribute('selmarks')],[[...textAnnotate.ifrm_document.querySelectorAll('#checkboxes input[type="checkbox"]')].filter(c=>{return c.checked; }).map(c=>{return c.parentElement.innerText;}) , [...textAnnotate.ifrm_document.querySelectorAll('#checkboxesCol input[type="checkbox"]')].filter(c=>{return c.checked; }).map(c=>{return c.parentElement.innerText;})],true,[textAnnotate.ifrm_document.getElementById('selText').innerText,textAnnotate.ifrm_document.getElementById('plainSearch').checked,textAnnotate.ifrm_document.getElementById('caseInsens').checked,textAnnotate.ifrm_document.getElementById('unic').checked]);
						}else{
							textAnnotate.populateFrame([slt.innerText,slt.getAttribute('selmarks')],[[...textAnnotate.ifrm_document.querySelectorAll('#checkboxes input[type="checkbox"]')].filter(c=>{return c.checked; }).map(c=>{return c.parentElement.innerText;}) , [...textAnnotate.ifrm_document.querySelectorAll('#checkboxesCol input[type="checkbox"]')].filter(c=>{return c.checked; }).map(c=>{return c.parentElement.innerText;})]);
						}
					}
					updateAnnotations();
			}
		}

		//textAnnotate.ifrm.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
		textAnnotate.ifrm.style.setProperty( 'margin', 0, 'important' );
		textAnnotate.ifrm.style.setProperty( 'border', 0, 'important' );
		textAnnotate.ifrm.style.setProperty( 'padding', 0, 'important' );
		textAnnotate.ifrm.style.setProperty( 'float', 'right', 'important' );

		/*let wifr=window.getComputedStyle(textAnnotate.ifrm);
		textAnnotate.sct.style.setProperty( 'height', wifr['height'], 'important' );
		textAnnotate.sct.style.setProperty( 'width', wifr['width'], 'important' );*/

		textAnnotate.ifrm_document.body.style.setProperty( 'background', '#333', 'important' );
		textAnnotate.ifrm_document.body.style.setProperty( 'margin', 0, 'important' );
		textAnnotate.ifrm_document.body.style.setProperty( 'border', 0, 'important' );
		textAnnotate.ifrm_document.body.style.setProperty( 'padding', 0, 'important' );
		textAnnotate.ifrm_document.body.style.setProperty( 'overflow', 'hidden', 'important' );
		textAnnotate.ifrm_document.body.style.setProperty( 'height','max-content', 'important' );

if(docEvts['pointerup']!==true){
		document.addEventListener('pointerup',(e)=>{ try{
			if(window.getSelection().toString()!=='' && textAnnotate.isSelecting===true){	
				textAnnotate.isSelecting=false;
				textAnnotate.sct.style.setProperty( 'display', 'inline-block','important' );
				textAnnotate.populateFrame();
			}else{
				textAnnotate.sct.style.setProperty( 'display', 'none','important' );
			}
		}catch(e){;}});
        docEvts['pointerup']=true;
}
	//}

		textAnnotate.ifrm_document.head.insertAdjacentHTML('afterbegin',`<style>
		* {
			color: white;
            background: unset;
		}
		button{
			background: buttonface;
			border-color: buttonface;
			color: black;
		}
		td, th {
			border: buttonface;
			border-style: inset;
			border-width: 0.2ch;
			text-align: center;
		}

		.multiselect {
		  width: max-content;
		}

		.selectBox {
			position: relative;
			min-width: 17.7ch;
		}
				
		.selectBox select {
		  width: 100%;
		  font-weight: bold;
		}
		
		#selText {
			min-width: 16.9ch;
		}

		.overSelect {
		  position: absolute;
		  left: 0;
		  right: 0;
		  top: 0;
		  bottom: 0;
		}

		#checkboxes.expanded{
			border: buttonface;
			border-style: outset;
			border-width: 0.3ch;
		}

		#checkboxes.expanded:not(:has(label)) {
		  display: block !important;
		  border: 0 !important;
		}

		#checkboxes label {
		  display: block;
		}

		#checkboxes label:hover {
		  background-color: #1e90ff;
		}

		input[type="checkbox"]{
			filter: hue-rotate(247deg) contrast(1.65) !important;
		}

		textarea.altText{
            border: buttonface;
            border-width: 1px;
            border-style: outset;
			vertical-align: bottom;
		}

		div.col{
			width: 4ch;
			margin-right: 0.57ch;
		}

		label.col{
			display: inline-flex;
		}

		div#checkboxesCol.expanded {
			border: buttonface 0.2ch outset;
			display: flex !important;
			flex-direction: column !important;
		}

		input[type="color" i]::-webkit-color-swatch {
			border-color: transparent !important;
			background-color: transparent !important;
		}

		label.col.pre {
			margin-top: 0.35ch;
		}
		</style>`);

		//post-selection
		textAnnotate.isSelecting=false;
    if(docEvts['selectstart']!==true){
		document.addEventListener('selectstart',(e)=>{ try{
			textAnnotate.isSelecting=true;
		}catch(e){;}});
        
        docEvts['selectstart']=true;
    }
		

	
}
	
	if(noMark!==true){
		textAnnotate.perChar(sel); // initialise; choose the relevant elements (that contains all the text you wish to annotate)
		isMarked=true;
					chrome.runtime.sendMessage({
                        message: isMarked ? 'marked' : 'not marked'
                    }, function(response) {;});
		if(textAnnotate.selector!==null){
			updateAnnotations();
		}
	}
    if(docEvts['pointermove']!==true && docEvts['touchend']!==true){
		document.addEventListener('pointermove',(e)=>{ try{
			textAnnotate.logMatchingAnnotations(e);
		}catch(e){;}});
		document.addEventListener('touchend',(e)=>{ try{ //For mobile
			textAnnotate.logMatchingAnnotations(e);
		}catch(e){;}});
    }
docEvts['pointermove']=true;
docEvts['touchend']=true;
}

function findURLmatch(items) {
	var blSite='';
	var blFcn=``;
	var found=false;
    for (let i = 0, len=addrs.length; i<len; i++) {
			if(addrs[i]===window.location.href){
					fcns=JSON.parse(LZString.decompressFromEncodedURIComponent(items.fcn_list));
				   return [true,addrs[i],JSON.parse(fcns[i]),i];
			}
		//console.log(found);
	}
	return [false,'','',null];
}

function getMatchingNodesShadow_order(docm, slc, isNodeName, onlyShadowRoots){
	
	function keepMatchesShadow(els,slcArr,isNodeName){
	   if(slcArr[0]===false){
		  return els;
	   }else{
			let out=[];
			for(let i=0, len=els.length; i<len; i++){
			  let n=els[i];
					for(let k=0, len_k=slcArr.length; k<len_k; k++){
						let sk=slcArr[k];
						if(isNodeName){
							if((n.nodeName.toLocaleLowerCase())===sk){
								out.push(n);
							}
						}else{ //selector
							   if(!!n.matches && typeof n.matches!=='undefined' && n.matches(sk)){
								  out.push(n);
							   }
						}
					}
			}
			return out;
		}
	}

	let slcArr=[];
	if(typeof(slc)==='string'){
		slc=(isNodeName && slc!==false)?(slc.toLocaleLowerCase()):slc;
		slcArr=[slc];
	}else if(typeof(slc[0])!=='undefined'){
		for(let i=0, len=slc.length; i<len; i++){
			let s=slc[i];
			slcArr.push((isNodeName && slc!==false)?(s.toLocaleLowerCase()):s)
		}
	}else{
		slcArr=[slc];
	}
	var shrc=[docm];
	var shrc_l=1;
	var out=[];
	let srCnt=0;

	while(srCnt<shrc_l){
		let curr=shrc[srCnt];
		let sh=(!!curr.shadowRoot && typeof curr.shadowRoot !=='undefined')?true:false;
		let nk=keepMatchesShadow([curr],slcArr,isNodeName);
		let nk_l=nk.length;
		
		if( !onlyShadowRoots && nk_l>0){
			for(let i=0; i<nk_l; i++){
				out.push(nk[i]);
			}
		}
		
        for(let i=curr.childNodes.length-1; i>=0; i--){
            shrc.splice(srCnt+1,0,curr.childNodes[i]);
		}
		
		if(sh){
			   let cs=curr.shadowRoot;
			   let csc=[...cs.childNodes];
			   if(onlyShadowRoots){
				  if(nk_l>0){
				   out.push({root:nk[0], childNodes:csc});
				  }
			   }
			   
                for(let i=csc.length-1; i>=0; i--){
                    shrc.splice(srCnt+1,0,csc[i]);
				}
		}

		srCnt++;
		shrc_l=shrc.length;
	}
	
	return out;
}

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}

async function start_up_storage(){
	return new Promise(function(resolve) {
		chrome.storage.local.get(null, function(items) {
							let setObj={}
							let setObjct=false;

							if(!!items.addrs_list && typeof  items.addrs_list!=='undefined'){
								addrs=JSON.parse(items.addrs_list);
							}else{
								setObj["addrs_list"]='[]';
								setObjct=true;
							}
							
							if(!items.fcn_list || typeof (items.fcn_list)==='undefined'){
								setObj["fcn_list"]=empty_JSON_arr;
								setObjct=true;
							}
								if(setObjct){
									chrome.storage.local.set(setObj, function() {
										chrome.storage.local.get(null, function(items) {
													 urlMatch=findURLmatch(items);
													resolve();
										});
									});
								}else{
									 urlMatch=findURLmatch(items);
									 resolve();
								}	
		});
	});
}

var fs={
				markPage: (s)=>{
					doMark(s);
				},
				markPageSave: (s)=>{
					doMark(s,true);
                    let ttl=tb_ttl.endsWith('.html') ? tb_ttl : (tb_ttl.endsWith('.')?tb_ttl+'html':tb_ttl+'.html');
                    savePage(ttl);
				},
				saveText: (s)=>{
					    let txt=[];
					    let scts=[];
						let sb={};
						let sel= s!==false && typeof(s)!=='undefined' && s.trim()!=='' ? getMatchingNodesShadow_order(document,s,false,false) : [document.documentElement];
							
						for(let i=0, len_i=sel.length; i<len_i; i++){
							let el=sel[i];
							let n=getMatchingNodesShadow_order(el, '#text', true, false);
							for(let k=0, len_k=n.length; k<len_k; k++){
								let nk=n[k];
								let pp=nk.parentElement;
								let anc=getAncestors(pp,true,true,false,true);
								let dtc=nk.textContent;
								for(let i=0, len_i=anc.length; i<len_i; i++){
									let sy=getScrollY(anc);
									anc[i].scrollIntoView({behavior: "instant", block: 'center', inline: "start"});
									let sy2=getScrollY(anc);
									if(sy!==sy2){
										out=anc[i];
										break;
									}
								}
								let bcr=pp.getBoundingClientRect();
								//let l=bcr.left+getScrollX(anc);
								let t=Math.round(bcr.top+getScrollY(anc));
								let ts=t.toString();
								let x=txt.length;
								if(typeof(sb[ts])==='undefined'){
									sb[ts]={top:t,els:[x]}
								}else{
									sb[ts].els.push(x);
								}
								txt.push(`<span>${dtc}</span>`);
							}
						}
						let sb2=[];
						for(key in sb){
							let sbk=sb[key];
							sb2.push([sbk.top,sbk.els]);
						}
						sortByArrCols(sb2,[0],[-1]);
						for(let k=0, len_k=sb2.length; k<len_k; k++){
							let s2k=sb2[k][1]; //els
							let gap=' ';
							if(k>0){
								let mt=sb2[k][0]-sb2[k-1][0];
								gap=` style="margin-top: calc(min(2.25ch,${mt}px));"`;
							}
							let sps=[`<section${gap}>`];
							for(let j=0, len_j=s2k.length; j<len_j; j++){
								let elx=s2k[j]; //indexes
								sps.push(txt[elx]);
							}
							scts.push(sps.join('')+'</section>')
						}
						
					let ttl=tb_ttl;
					if(ttl.endsWith('.html')){
						ttl=ttl.split('.html')[0]+'.txt.html';
					}else if(ttl.endsWith('.txt')){
						ttl+='.html';
					}else if(ttl.endsWith('.')){
						ttl+='txt.html';
					}else{
						ttl+='.txt.html';
					}
					
					let markTxt_html=`<html>
					<head>
					<meta charset="UTF-8">
					<style>
					section{
						position: relative;
						display: flex;
						flex-wrap: wrap;
					}
					</style>
					</head>
					<body><main style="white-space: pre-wrap !important;position:absolute; left:0.5%;top:0ch;width: 98.5%;">${scts.join('')}</main></html>`
                    savePage(ttl,markTxt_html);
				},
				setupPatt: (s)=>{ //setup pattent-based annotation window
					textAnnotate.populateFrame(undefined,undefined,true);
				}
}

function start_up(){
	if(firstDone===true){
		return;
	}
	firstDone=true;
	try{
		(async ()=>{
			await start_up_storage();
            let testMk=document.createElement('mark');
            let testMk2=document.createElement('mark');
            testMk.className='';
            testMk2.className='no_hl';
            testMk.style.cssText='opacity: 0 !important;';
            testMk2.style.cssText='opacity: 0 !important;';
            testMk2.setAttribute('indexnumber',true);
            document.body.insertAdjacentElement('beforeend',testMk);
            document.body.insertAdjacentElement('beforeend',testMk2);
            let wcs=window.getComputedStyle(testMk);
            let wcs2=window.getComputedStyle(testMk2);
			let cssw=[ wcs['color'],  wcs2['color'], wcs['background-color'],  wcs2['background-color']];
			isMarked= (cssw[0]!==cssw[1] || cssw[2]!==cssw[3] )  && cssw.join('').trim()!==''  ? true : false;
            elRemover(testMk2);
            elRemover(testMk);
			if(urlMatch[0] || isMarked){
				let u2=urlMatch[2];
				if(!isMarked){ // not local
					doMark(u2.selector,false,false);
				}else{
					doMark(false,false,true);
				}
				for(k in u2){
					textAnnotate[k]=u2[k];
				}
					let stx=getMatchingNodesShadow_order(document,'mark[indexnumber]',false,false);
										
					if(isMarked && (textAnnotate.markText==='' || textAnnotate.markText===null ) ){
							let mt=[];
							for(let i=0, len_i=stx.length; i<len_i; i++){
								mt.push(stx[i].textContent);
							}
							textAnnotate.markText=mt.join('');
					}
				for(let x=0, len_x=textAnnotate.annotations.length; x<len_x; x++){
						let ax=textAnnotate.annotations[x];
						let stx2=getMatchingNodesShadow_order(document,'mark[indexnumber]',false,false).filter(m=>{let n=parseInt(m.getAttribute('indexnumber')); return ax.nodeIndexes.includes(n); });
						for(let i=0, len_i=stx2.length; i<len_i; i++){
							let stx2i=stx2[i];
							stx2i.className='';
							stx2i.style.backgroundColor=ax.hexRGB;
							stx2i.style.color=ax.textCol;
						}
				}
			}
		})();
	}catch(e){;}
}

if (
  (document.readyState === "complete") ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  start_up();
} else {
  document.addEventListener("DOMContentLoaded", start_up);
}

function gotMessage(message, sender, sendResponse) {
    let m=message.message;
    tb_ttl=message.title;
	if(m==='getStatus'){ //Send back whether the page is already marked
	tb_id=message.tabId;
		chrome.runtime.sendMessage({
                        message: isMarked ? 'marked' : 'not marked'
                    }, function(response) {;});
	}else{
		fs[m[0]](m[1]);
	}
}

chrome.runtime.onMessage.addListener(gotMessage);


function timer_func(){
            if (window.location.href != chg) {
                chg = window.location.href;
                hashReset();
			}
}


if(typeof observer ==="undefined" && typeof timer ==="undefined"){
	var timer;
	var timer_tm=null;
const observer = new MutationObserver((mutations) =>
{
	if(timer){
		clearTimeout(timer);
		if(performance.now()-timer_tm>=3000){
			timer_func();
			timer_tm=performance.now();
		}
	}
	
	timer = setTimeout(() =>
	{
		timer_func();
		timer_tm=performance.now();
	}, 1000);
	
	if(timer_tm ===null){
		timer_tm=performance.now();
	}
});


observer.observe(document, {
    subtree: true,
	childList: true,
	attributes: true,
	attributeOldValue: true,
	characterData: true,
	characterDataOldValue: true
});
		
}

if(typeof observer2 ==="undefined"){
const observer2 = new MutationObserver((mutations) =>
{
if(urlMatch[0] || isMarked){
	
	let adn=mutations.map(m=>{return [...m.addedNodes]});
	for(let i=0, len_i=adn.length; i<len_i; ++i){
		let adni=adn[i];
		for(let k=0, len_k=adni.length; k<len_k; ++k){
			let adnik=adni[k];
            let x=null;
            try{
                x=adnik.getAttribute('indexnumber');
            }catch(e){;}
			if(adnik.nodeName==='MARK' && x!==null){
				addedNodes_toProc.push([adnik,x]);
			}else{
                let mks=getMatchingNodesShadow_order(adnik,'mark[indexnumber]',false,false);
                for(let j=0, len_j=mks.length; j<len_j; ++j){
                let mksj=mks[j];
                addedNodes_toProc.push([mksj,mksj.getAttribute('indexnumber')]);
      }
            }
		}
	}
	let adnl=addedNodes_toProc.length;
	if(adnl>0){
	let lookup_m={};
			for(let i=0; i<adnl; ++i){
				let m=addedNodes_toProc[i];
				lookup_m[m[1]]=m[0];
			}
			for(let i=0, len_i=textAnnotate.annotations.length; i<len_i; ++i){
				let ai=textAnnotate.annotations[i];
				for(let j=0, len_j=ai.nodeIndexes.length; j<len_j; ++j){
					let aij=ai.nodeIndexes[j];
					let s=aij.toString();
					if(typeof(lookup_m[s])!=='undefined'){
						let m=lookup_m[s];
						m.classList.remove('no_hl');
						m.style.backgroundColor=ai.hexRGB;
						m.setAttribute('textcol',ai.textCol);
					}
				}
			}
			addedNodes_toProc=[];
	}
}
});


observer2.observe(document, {
    subtree: true,
	childList: true
});
		
}