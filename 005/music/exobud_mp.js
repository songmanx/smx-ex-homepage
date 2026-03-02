// ExoBUD™ MPlayer 1.8 [정식버전]
// Copyright (Pe) 2001 ExoBUD™ , Design by Jinwoong, YU. 
// Home : HTTP://exobud.nayana.org
// E-Mail  : exobud@hanmail.net
// ICQ     : 96138429

// 본 소스의 상기 내용을 변경하거나 삭제하시면 안됩니다. 
// 본소스는 무료스크립트이며, 사용자 임으로 수정.배포 하실 수 없습니다.
// 본 소스로 인해 발생된 문제에 대해서는 어떠한 책임도 지지않습니다.
// 본 소스를 본인 동의없이 화일의 일부 또는 전체를 배포하거나 화일다운링크를 걸어두시면 안됩니다.

var Copyright = "ExoBUD™"; // 삭제금지. 삭제이후 발생된 문제에 대한 책임은 수정자에게 있음.
var ExoBUD_MP_ChkPlayId
var ExoBUD_MP_VolDnEvent = 0; 
var ExoBUD_MP_PlayState; 
var ExoBUD_MP_Stopmode = 0; 
var ExoBUD_MP_Track = null;
var ExoBUD_MP_TrackName = null;
var ExoBUD_MP_CurrentTrack = 0;
var ExoBUD_MP_TrackCount = 0;
var ExoBUD_MP_Looping = false;
var g_Browser = navigator.appName;

function ExoBUD_MP_ChgMode(){
	if(ExoBUD_MP_PlayMode == 0){
		ExoBUD_MP_PlayMode=1;
		document.ExoBUD_MP_form.pmode.value = "R";
	}
	else{
		ExoBUD_MP_PlayMode=0;
		document.ExoBUD_MP_form.pmode.value = "S";
	}
}

function ExoBUD_MP_Setting() { //ExoBUD™ MPlayer Initialization 
	document.ExoBUD_MP_form.scope.style.visibility = "hidden";
	document.ExoBUD_MP_form.scope.style.width = 0;


	if(ExoBUD_MP_ShowTitle == 0 || ExoBUD_MP_ShowTitle == 2){
		document.ExoBUD_MP_form.ShowTitle.style.visibility = "hidden";
		document.ExoBUD_MP_form.ShowTitle.style.width = 0;
	}

	if(ExoBUD_MP_ShowVCtrl == 0) {
		document.ExoBUD_MP_form.mutemode.style.visibility = "hidden";
		document.ExoBUD_MP_form.mutemode.style.width = 0;

		document.ExoBUD_MP_form.vdn.style.visibility = "hidden";
		document.ExoBUD_MP_form.vdn.style.width = 0;

		document.ExoBUD_MP_form.vup.style.visibility = "hidden";
		document.ExoBUD_MP_form.vup.style.width = 0;
	}

	if(ExoBUD_MP_ShowPList == 0){
		document.ExoBUD_MP_form.plist.style.visibility = "hidden";
		document.ExoBUD_MP_form.plist.style.width = 0;
	}

	if(ExoBUD_MP_PlayMode == 0){ document.ExoBUD_MP_form.pmode.value = "S";}
	else {document.ExoBUD_MP_form.pmode.value = "R";}

	window.defaultstatus = (' ▒ ExoBUD™ MPlayer v1.8 ▒');
	document.ExoBUD_MP_form.ShowTitle.value = " ▒ ExoBUD MPlayer v 1.8 입니다 ▒"
	if (ExoBUD_MP_PlayOnLoaded == 1) { ExoBUD_MP_Play(); }
}


function ExoBUD_MP_Play() { // ExoBUD™ MPlayer Initial Track setting
	if (g_Browser == "Netscape") {ExoBUD_MP_PlayState = document.ExoBUDMP.GetPlayState();}
	else { ExoBUD_MP_PlayState = document.ExoBUDMP.PlayState; } // stop(0) pause(1) play(2)

	if(ExoBUD_MP_PlayState == 1 ) {
		document.ExoBUDMP.Play();
		document.ExoBUD_MP_form.pnpt.style.background= colorOfModeOff ;	
	} // 현재 pause 중이라면 재생
                else if(ExoBUD_MP_PlayState == 2) {return true;}
	else{
		if (ExoBUD_MP_PlayMode == 1) {
			ExoBUD_MP_CurrentTrack = Math.floor(Math.random() * ExoBUD_MP_Track.length);
		}
		else {ExoBUD_MP_CurrentTrack = 0; }

		ExoBUD_MP_Stopmode = 0;
		ExoBUD_MP_SelectTrack(ExoBUD_MP_CurrentTrack);
	}
}


function ExoBUD_MP_SelectTrack(ctrack) { // ExoBUD™ MPlayer Current Track open,  playing state checking run 
	clearTimeout(ExoBUD_MP_ChkPlayId);  
	document.ExoBUDMP.Stop();
	ExoBUD_MP_CurrentTrack = ctrack; 
	document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOff;

	if(ExoBUD_MP_CurrentTrack < 0 || ExoBUD_MP_CurrentTrack > (ExoBUD_MP_Track.length - 1) ) {
		ExoBUD_MP_StopTrack();
	}
	else {
		ExoBUD_MP_Stopmode =0;
		var ExoBUD_MP_CurrentTrackURL = ExoBUD_MP_Track[ExoBUD_MP_CurrentTrack];
		document.ExoBUDMP.Open(ExoBUD_MP_CurrentTrackURL);

		document.ExoBUD_MP_form.scope.style.visibility = "visible" ;
		document.ExoBUD_MP_form.scope.style.width = 16 ;
 
		var flag1=1; 
		ExoBUD_MP_UpdateTrack(flag1); //ExoBUD™ MPlayer ViewBar for showing Music Title Update
	}
}

function ExoBUD_MP_Error(){
	ExoBUD_MP_ChkPlayId = setTimeout('ExoBUD_MP_ChkPlay()', 5000);
 }

function ExoBUD_MP_ChkPlay(){ // ExoBUD™ MPlayer Play state check & Next track return
	clearTimeout(ExoBUD_MP_ChkPlayId);  
	if (g_Browser == "Netscape") {ExoBUD_MP_PlayState = document.ExoBUDMP.GetPlayState();}
	else { ExoBUD_MP_PlayState = document.ExoBUDMP.PlayState; } // stop(0) pause(1) play(2)

	if(ExoBUD_MP_Stopmode ==0) { // while playing or being paused, check stop point and then run next track

		if (ExoBUD_MP_PlayState ==2 || ExoBUD_MP_PlayState ==1) {
			return true;
		} 
		else {
			var flag1=1;
			ExoBUD_MP_ChkLooping(); 
			ExoBUD_MP_UpdateTrack(flag1);
		 }
	}
}


function ExoBUD_MP_ChkLooping() {  //ExoBUD™ MPlayer Loop condition Check for replaying current Track
	if ( ExoBUD_MP_Looping == true ) { ExoBUD_MP_SelectTrack(ExoBUD_MP_CurrentTrack); }
	else { ExoBUD_MP_NextTrack();}
}


function ExoBUD_MP_NextTrack() { //ExoBUD™ MPlayer Next track Setting
	if (ExoBUD_MP_PlayMode == 1) { var ntrack = Math.floor(Math.random() * ExoBUD_MP_Track.length); } 
	else {
		if(ExoBUD_MP_CurrentTrack == (ExoBUD_MP_Track.length - 1)) { var ntrack = 0; }
		else { var ntrack = ExoBUD_MP_CurrentTrack + 1; }
	}
	ExoBUD_MP_SelectTrack(ntrack);
}


function ExoBUD_MP_PrevTrack() { //ExoBUD™ MPlayer Prev. Track Setting
	if (ExoBUD_MP_PlayMode == 1) { var ptrack = Math.floor(Math.random() * ExoBUD_MP_Track.length); }
	else {
		if(ExoBUD_MP_CurrentTrack == 0) { var ptrack = ExoBUD_MP_Track.length - 1; }
		else { var ptrack = ExoBUD_MP_CurrentTrack - 1; }
	}
	ExoBUD_MP_SelectTrack(ptrack);
}


function ExoBUD_MP_PauseTrack(){//ExoBUD™ MPlayer Pause Control :현재사용안함
               document.ExoBUDMP.Pause();
	}


function ExoBUD_MP_PlayPause(){//ExoBUD™ MPlayer Play & Pause Toggle 
	if (g_Browser == "Netscape"){ExoBUD_MP_PlayState = document.ExoBUDMP.GetPlayState();}
	else {ExoBUD_MP_PlayState = document.ExoBUDMP.PlayState;} // stop(0) pause(1) play(2)

	if (ExoBUD_MP_PlayState == 0) { 
		document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOff;	
		return false;
	}
	else if (ExoBUD_MP_PlayState == 1) {
		document.ExoBUDMP.Play();
		document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOff;
	}
	else if (ExoBUD_MP_PlayState == 2) {
		document.ExoBUDMP.Pause();
		document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOn;
		}
	else {
		document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOff;	
		return false;
	}
}

function ExoBUD_MP_StopTrack() { //ExoBUD™ MPlayer Stop & refresh Viewbar
	clearTimeout(ExoBUD_MP_ChkPlayId);  
	document.ExoBUDMP.Stop(); 
	document.ExoBUD_MP_form.pnpt.style.background=colorOfModeOff;	
	document.ExoBUD_MP_form.scope.style.visibility = "hidden";
	document.ExoBUD_MP_form.scope.style.width = 0;

	ExoBUD_MP_Stopmode = 1;
	ExoBUD_MP_UpdateTrack();
}


function ExoBUD_MP_VolUp(){ // ExoBUD™ MPlayer Volume Up 
	if(document.ExoBUDMP.mute == true){
		document.ExoBUDMP.mute = false;
		document.ExoBUD_MP_form.mutemode.style.background = colorOfModeOff;}
	else{
		if (document.ExoBUDMP.volume >= 0) {document.ExoBUDMP.volume = 0;}
		else {  document.ExoBUDMP.volume = document.ExoBUDMP.volume + 200;}
	}
}


function ExoBUD_MP_Mute(){ // ExoBUD™ MPlayer Mute 
	if(document.ExoBUDMP.mute == false){
		document.ExoBUDMP.mute = true;
		document.ExoBUD_MP_form.mutemode.style.background = colorOfModeOn;
	}
	else if(document.ExoBUDMP.mute == true){
		document.ExoBUDMP.mute = false;
		document.ExoBUD_MP_form.mutemode.style.background = colorOfModeOff;
	}

}


function ExoBUD_MP_VolDown(){ // ExoBUD™ MPlayer Volume Down 
	if(document.ExoBUDMP.mute == true){
		document.ExoBUDMP.mute = false;
		document.ExoBUD_MP_form.mutemode.style.background = colorOfModeOff;}
	else{
		if (document.ExoBUDMP.volume <= -4000){ document.ExoBUDMP.volume = -4000;}
		else{document.ExoBUDMP.volume = document.ExoBUDMP.volume - 200;}
	}
}


function ExoBUD_MP_ChgLooping() { //ExoBUD™ MPlayer Loop controller
	if (ExoBUD_MP_Looping == false) {ExoBUD_MP_Looping = true;
		document.ExoBUD_MP_form.loop.style.background = colorOfModeOn;
	}
	else {ExoBUD_MP_Looping = false;
		document.ExoBUD_MP_form.loop.style.background = colorOfModeOff;
	}
}

// 음악등록방법입니다. [exobud_mp.html에 기술할 부분입니다.]
// ExoBUD_MP_AddPlayList('음악 파일의 경로(절대.상대경로)', '음악 제목'); 형식으로 써주시면 됩니다.
// 상대경로로 사용할때는 exobud_mp.html 이 위치한 경로를 기준으로한 상대경로를 주시면 됩니다.
// 제목입력을 하지 않으면 'Track 번호' 만 표기됩니다.

function ExoBUD_MP_AddPlayList( url, tit) { //ExoBUD™ MPlayer List array marking
	if (ExoBUD_MP_Track == null) { ExoBUD_MP_Track = new Array(); ExoBUD_MP_TrackCount = 0;}
	else { ExoBUD_MP_TrackCount = ExoBUD_MP_Track.length; }

	if (ExoBUD_MP_TrackName == null) { ExoBUD_MP_TrackName = new Array(); }

	ExoBUD_MP_Track[ExoBUD_MP_TrackCount] = url;

	if (tit == null || tit == '' ) { ExoBUD_MP_Title = 'ExoBUD™ Mplayer Track [' + (ExoBUD_MP_TrackCount + 1) + '] '; } 
	else { ExoBUD_MP_Title = tit; }

	ExoBUD_MP_TrackName[ExoBUD_MP_TrackCount] = ExoBUD_MP_Title;
}


function ExoBUD_MP_UpdateTrack(f) { //ExoBUD™ MPlayer Update ViewBar

	if (f == 1) { // while playing state
		ExoBUD_MP_CurrentTrack_idx = ExoBUD_MP_CurrentTrack + 1; // array start index 0, real track is ++1

		switch(ExoBUD_MP_ShowTitle) {
			case 0 :
				window.status = (' ▒ ExoBUD™ MPlayer ▒'); return true;
				break;
			case 1 :
				document.ExoBUD_MP_form.ShowTitle.value = "[T:" + ExoBUD_MP_CurrentTrack_idx + "] " + ExoBUD_MP_TrackName[ExoBUD_MP_CurrentTrack];
				break;
			case 2 :
				window.status = (' ▒ ExoBUD™ MPlayer Current Track [' + ExoBUD_MP_CurrentTrack_idx + '] ▒ ' + ExoBUD_MP_TrackName[ExoBUD_MP_CurrentTrack] + ' ▒');
				return true;
				break;
			case 3 :
				document.ExoBUD_MP_form.ShowTitle.value = " [T:" + ExoBUD_MP_CurrentTrack_idx + "] " + ExoBUD_MP_TrackName[ExoBUD_MP_CurrentTrack];
				window.status = (' ▒ ExoBUD™ MPlayer Current Track [' + ExoBUD_MP_CurrentTrack_idx + '] ▒ ' + ExoBUD_MP_TrackName[ExoBUD_MP_CurrentTrack] + ' ▒');
				return true;
				break;
			default :
				window.status = (' ▒ ExoBUD™ MPlayer ▒'); return true;
		}
	}
	else { // when Stop state

		document.ExoBUD_MP_form.ShowTitle.value = " ▒ ExoBUD MPlayer : 재생중지 ▒";
		window.status = (' ▒ ExoBUD™ MPlayer :재생중지  ▒');	return true;
	}
}

