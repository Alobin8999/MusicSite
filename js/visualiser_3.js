let bgViewIs = 1;
let fftSizeUpdate = 4096;
let setColor = false;

function bgView1(){
	bgViewIs = 1;
	console.log('1');
	document.getElementById("bg_view_1").style.scale = 1.05;
	document.getElementById("bg_view_1").style.background = '#7F681B';
	document.getElementById("bg_view_2").style.scale = 1;
	document.getElementById("bg_view_2").style.background = '#3F6482';
	document.getElementById("bg_view_3").style.scale = 1;
	document.getElementById("bg_view_3").style.background = '#3F6482';
}
function bgView2(){
	bgViewIs = 2;
	console.log('2');
	document.getElementById("bg_view_2").style.scale = 1.05;
	document.getElementById("bg_view_2").style.background = '#7F681B';
	document.getElementById("bg_view_1").style.scale = 1;
	document.getElementById("bg_view_1").style.background = '#3F6482';
	document.getElementById("bg_view_3").style.scale = 1;
	document.getElementById("bg_view_3").style.background = '#3F6482';
}
function bgView3(){
	bgViewIs = 3;
	console.log('3');
	document.getElementById("bg_view_3").style.scale = 1.05;
	document.getElementById("bg_view_3").style.background = '#7F681B';
	document.getElementById("bg_view_2").style.scale = 1;
	document.getElementById("bg_view_2").style.background = '#3F6482';
	document.getElementById("bg_view_1").style.scale = 1;
	document.getElementById("bg_view_1").style.background = '#3F6482';
}
function bgViewMore(){
	if(!setColor){
		setColor = true;
		document.getElementById("bg_view_more").style.scale = 1.05;
		document.getElementById("bg_view_more").style.background = '#7F681B';
	} else {
		setColor = false;
		document.getElementById("bg_view_more").style.background = '#203B4A';
		document.getElementById("bg_view_more").style.scale = 1;
	}
}
let paused = true;
function playMusic(){
	var audio = document.getElementById("audio_ag");
	if (paused){
		audio.duration = 0;
		audio.play();
		document.getElementById("play").style.display = 'none';
		document.getElementById("pause").style.display = 'block';
		paused = !paused;
	} else {
		audio.pause();
		document.getElementById("pause").style.display = 'none';
		document.getElementById("play").style.display = 'block';
		paused = !paused;
	}
}
let looped = false;
function loop(){
	var audio = document.getElementById("audio_ag");
	if (!looped){
		audio.loop=true;
		document.getElementById("loop").style.scale = 1.05;
		document.getElementById("loop").style.background = '#7F681B';
		looped = !looped;
	} else {
		audio.loop=false;
		looped = !looped;
		document.getElementById("loop").style.background = '#3F6482';
		document.getElementById("loop").style.scale = 1;
	}
}
function main(){
	const playButton = document.getElementById('play');
	const canvas = document.getElementById('AGCanvas');
	const ctx = canvas.getContext('2d');
	const audio = document.getElementById("audio_ag");
	const file = document.getElementById("thefile");
	canvas.width = document.getElementById('music_container').offsetWidth;
	canvas.height = document.getElementById('music_container').offsetHeight;
	window.onresize = function(){
		canvas.width = document.getElementById('music_container').offsetWidth;
		canvas.height = document.getElementById('music_container').offsetHeight;
	}
	let audioSource;
	let analyser;
	
	document.getElementById("listeners").textContent = "Слушателей за месяц   //   " + Math.floor(Math.random() * 100000);
	
	file.onchange = function() {
		paused = false;
		document.getElementById("play").style.display = 'none';
		document.getElementById("pause").style.display = 'block';
		document.getElementById("progress").style.display = 'flex';
		var files = this.files;
		audio.src = URL.createObjectURL(files[0]);
		const audioContext = new AudioContext();
		audio.load();
		audio.play();
		audioSource = audioContext.createMediaElementSource(audio);
		analyser = audioContext.createAnalyser();
		audioSource.connect(analyser);
		analyser.connect(audioContext.destination);
		analyser.fftSize = fftSizeUpdate;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		
		let barHeight;
		let x;
		
		let progress = document.getElementById("progress");
		audio.ontimeupdate = function(){
				let ct = audio.currentTime;
				let duration = audio.duration;
				prog = Math.floor((ct*100)/duration);
				progress.style.setProperty("--progress",prog+"%");
		}
		
		let message = 0;
		audio.addEventListener("ended", function(){
			document.getElementById("pause").style.display = 'none';
			document.getElementById("play").style.display = 'block';
			paused = !paused;
			if (message == 0){
				document.getElementById('stars').style.display = 'block';
				message = 1;
			}
		});
		
		function animate(){
			if (bgViewIs == 1){
				const barWidth = (canvas.width/4)/bufferLength;
				x = 0;
				ctx.clearRect(-3000,-3000,canvas.width+4000,canvas.height+4000);
				ctx.save();
				ctx.scale(1.5,1.5);
				ctx.translate(-canvas.width/6, -canvas.height/9.2);
				analyser.getByteFrequencyData(dataArray);
				//drawVisualizer(bufferLength,x,barWidth,barHeight,dataArray);
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,1)';
					} else {
						ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%)';
					}
					ctx.fillRect(canvas.width/2 - x, canvas.height/2 - barHeight, barWidth*2, barHeight)
					x += barWidth*1.5;
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i] * 1.5;
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,0.35)';
					} else {
						ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%, 0.35)';
					}
					ctx.fillRect(canvas.width/1.1425 - x, canvas.height/2, barWidth, barHeight/2.5)
					x += barWidth*1.5;
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i] * 1.5;
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,0.35)';
					} else {
						ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%, 0.35)';
					}
					ctx.fillRect(x - canvas.width/4, canvas.height/2, barWidth, barHeight/2.5)
					x += barWidth*1.5;
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,1)';
					} else {
						ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%)';
					}
					ctx.fillRect(x - canvas.width/1.6, canvas.height/2 - barHeight, barWidth*2, barHeight)
					x += barWidth*1.5;
				}
				ctx.restore();
				requestAnimationFrame(animate)
				
			} else if (bgViewIs == 3){
				const barWidth = ((canvas.width*6)/4)/bufferLength;
				x = 0;
				ctx.clearRect(-3000,-3000,canvas.width+4000,canvas.height+4000);
				//ctx.translate(canvas.width/2, canvas.height/2);
				//ctx.rotate(-Math.PI/(180 * 40))
				//ctx.translate(-canvas.width/2, -canvas.height/2);
				analyser.getByteFrequencyData(dataArray);
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save();
					ctx.translate(canvas.width/2, canvas.height/2);
					ctx.rotate(i * Math.PI * 12 / bufferLength);
						
					ctx.beginPath();
					ctx.stroke();
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,1)';
					} else {
						ctx.fillStyle = 'hsl(' + i/2 + ', 100%, 50%)';
					}
					ctx.fillRect(50, i*2, barWidth, barHeight )
						
					x += barWidth;
					ctx.restore();
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save();
					ctx.translate(canvas.width/2, canvas.height/2);
					ctx.rotate(i * Math.PI * 12 / bufferLength);
						
					ctx.beginPath();
					ctx.stroke();
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,1)';
					} else {
						ctx.fillStyle = 'hsl(' + i/2 + ', 100%, 50%)';
					}
					ctx.fillRect(-50, i*-2, -barWidth, -barHeight )
						
					x += barWidth;
					ctx.restore();
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save();
					ctx.translate(canvas.width/2, canvas.height/2);
					ctx.rotate(i * Math.PI * 12 / bufferLength);
						
					ctx.beginPath();
					ctx.stroke();
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,0.35)';
					} else {
						ctx.fillStyle = 'hsl(' + i/2 + ', 100%, 50%, 0.425)';
					}
					ctx.fillRect(-50, i*-2, barWidth, barHeight/2.5 )
						
					x += barWidth;
					ctx.restore();
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save();
					ctx.translate(canvas.width/2, canvas.height/2);
					ctx.rotate(i * Math.PI * 12 / bufferLength);
						
					ctx.beginPath();
					ctx.stroke();
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,0.35)';
					} else {
						ctx.fillStyle = 'hsl(' + i/2 + ', 100%, 50%, 0.35)';
					}
					ctx.fillRect(50, i*2, -barWidth, -barHeight/2.5 )
						
					x += barWidth;
					ctx.restore();
				}
				
				ctx.restore();
				requestAnimationFrame(animate);
			} else if (bgViewIs == 2){
				const barWidth = (canvas.width*3)/bufferLength;
				x = 0;
				ctx.clearRect(-3000,-3000,canvas.width+4000,canvas.height+4000);
				//ctx.translate(canvas.width/2, canvas.height/2);
				//ctx.rotate(-Math.PI/(180 * 40))
				//ctx.translate(-canvas.width/2, -canvas.height/2);
				analyser.getByteFrequencyData(dataArray);
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i] * 1.25;
					ctx.save();
					ctx.translate(canvas.width/2, canvas.height/2);
					ctx.rotate(i * Math.PI * 24 / bufferLength);
					ctx.scale(0.4, 0.4)
						
					ctx.beginPath();
					ctx.stroke();
					if(setColor){
						ctx.fillStyle = 'rgb(50,183,255,1)';
					} else {
						ctx.fillStyle = 'hsl(' + i/2 + ', 100%, 50%)';
					}
					ctx.fillRect(0, i*2.5, barWidth, barHeight )
						
					x += barWidth;
					ctx.restore();
				}
				
				ctx.restore();
				requestAnimationFrame(animate);
			}
		}
		animate();
	}
	/*function drawVisualizer(bufferLength,x,barWidth,barHeight,dataArray,f){
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save()
					ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%)';
					ctx.fillRect(canvas.width/2 - x, canvas.height/2, barWidth, barHeight/2)
					x += barWidth;
					ctx.restore();
				}
				for (let i = 0; i < bufferLength; i++){
					barHeight = dataArray[i];
					ctx.save()
					ctx.fillStyle = 'hsl(' + i/6 + ', 100%, 50%)';
					ctx.fillRect(x, canvas.height/2, barWidth, barHeight/2)
					x += barWidth;
					ctx.restore();
				}
	}*/
	
	myVid=document.getElementById("audio_ag");
	myVid.volume=0.1;
	
	document.getElementById("bg_view_1").style.scale = 1.05;
	document.getElementById("bg_view_1").style.background = '#7F681B';
	document.getElementById("bg_view_more").style.background = '#203B4A';
}

let visibleSwitch = false;

function visibleFooter(){
	if (!visibleSwitch){
		document.getElementById("player").style.opacity = 0.15;
		document.getElementById("header").style.visibility = 'hidden'
		document.getElementById("header").style.opacity = 0;
		document.getElementById("main").style.visibility = 'hidden';
		document.getElementById("main").style.opacity = 0;
		document.getElementById("footer").style.visibility = 'hidden';
		document.getElementById("footer").style.opacity = 0;
		
		document.getElementById("visible").style.scale = 1.05;
		document.getElementById("visible").style.background = '#7F681B';
		
		document.body.style.overflow = "hidden";
		visibleSwitch = !visibleSwitch;
	} else {
		document.getElementById("player").style.opacity = 1;
		document.getElementById("header").style.opacity = 1;
		document.getElementById("main").style.opacity = 1;
		document.getElementById("footer").style.opacity = 1;
		document.getElementById("header").style.visibility = 'visible'
		document.getElementById("main").style.visibility = 'visible';
		document.getElementById("footer").style.visibility = 'visible';
		
		document.getElementById("visible").style.background = '#3F6482';
		document.getElementById("visible").style.scale = 1;
		
		document.body.style.overflow = "visible";
		visibleSwitch = !visibleSwitch;
	}
}

function togo(){
	alert('togo');
}
function search(){
	alert('По запросу ' + document.getElementById('search').value + ' ничего не найдено')
}
function coment(){
	alert('К сожелению, эта функция сейчас не доступна')
}
function send(){
	alert('Это какая-то магическая технология, которая не поддается осознанию...')
}
function login(){
	alert('От сюда это вряд ли получится. Если один способ - попробуйте зарегистрироваться через сайт Госуслуг...')
	window.open('https://www.gosuslugi.ru/', '_blank').focus();
}
let likeCheck = false;
function clickLike(){
	if(!likeCheck){
		document.getElementById("heart").style.display = 'none';
		document.getElementById("like").style.display = 'block';
		likeCheck = !likeCheck;
	} else {
		document.getElementById("like").style.display = "none";
		document.getElementById("heart").style.display = 'block';
		likeCheck = !likeCheck;
	}
}
function download(){
	window.location.href = 'https://storage1.lightaudio.ru/dm/3992256b/12ba90e5/Tobu%20%E2%80%94%20Infectious%20%28Original%20Mix%29.mp3';
}
function openSong(){
	alert('Технические неполадки. Станица данной песни пока не доступна');
}
function openAuthor(){
	alert('Технические неполадки. Станица данного исполнителя пока не доступна');
}