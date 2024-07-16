document.getElementsByTagName('SCRIPT')[0].outerHTML=`<script>
function setHeights(event){
	let t=event.target;
	t.style.height='min-content';
	t.style.height=t.scrollHeight+3;
}

function checkCols(event){
	let t=event.target;
	let cols=[...document.querySelectorAll('input.col[type="checkbox"]:checked')];
	console.dir([cols,t]);
	if(cols.length===2){
		let ixn=cols.findIndex((c)=>{return c!==t});
		cols[ixn].checked=false;
		t.checked=true;
	}
}

function editAnn(event,ix){
	let t=event.target;
	let ta=t.textAnnotate;
	ta.populateFrame(ix);
}

function remAnn(event){
	let t=event.target;
	let ta=t.textAnnotate;
	ta.remove(parseInt(t.getAttribute('ix')));
	ta.sct.style.setProperty( 'display', 'none','important' );
}

function customCol(event){
	let t=event.target;
	t.style.backgroundColor=t.value;
	t.style.border=t.value;
	let cn=t.parentElement.childNodes;
	if(cn[cn.length-1].textContent==='Custom'){
		let cols=[...document.querySelectorAll('input.col[type="checkbox"]:checked')];
		cols.forEach(c=>{
			c.checked=false;
		});
		t.previousElementSibling.checked=true;
	}
	cn[cn.length-1].textContent=t.value.toLocaleUpperCase();
}
		let expanded = true;
		function showCheckboxes(col) {
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
		}
		</script>`;