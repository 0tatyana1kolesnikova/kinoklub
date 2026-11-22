(() => {
  const $ = id => document.getElementById(id);
  const player=$('player'), library=$('library');
  const movies=Array.isArray(window.MOVIES)?window.MOVIES:[];
  let objectUrl=null;
  $('count').textContent=movies.length;
  function setVideo(url,title,description){
    player.pause(); if(objectUrl) URL.revokeObjectURL(objectUrl); objectUrl=url.startsWith('blob:')?url:null;
    player.src=url; player.hidden=false; $('placeholder').hidden=true; $('loading').hidden=true;
    $('title').textContent=title; $('status').textContent=description||'Нажми ▶, чтобы смотреть.'; player.load();
  }
  function card(movie){
    const button=document.createElement('button'); button.type='button'; button.className='card';
    const thumb=document.createElement('span'); thumb.className='thumb'; thumb.textContent='▶';
    const text=document.createElement('span'); text.className='card-text';
    const title=document.createElement('strong'); title.textContent=movie.title;
    const desc=document.createElement('small'); desc.textContent=movie.description||'Смотреть видео';
    text.append(title,desc); button.append(thumb,text);
    button.addEventListener('click',()=>{
      document.querySelectorAll('.card').forEach(el=>el.classList.remove('active')); button.classList.add('active');
      setVideo(movie.url,movie.title,'Видео воспроизводится по мере загрузки.');
      player.play().catch(()=>{$('status').textContent='Нажми ▶ на плеере, чтобы начать просмотр.';});
    }); return button;
  }
  movies.forEach(movie=>library.append(card(movie)));
  if(movies.length){library.children[0].classList.add('active');setVideo(movies[0].url,movies[0].title,'Нажми ▶, чтобы начать просмотр.');}
  $('pick').addEventListener('click',()=>$('file').click());
  $('file').addEventListener('change',()=>{const file=$('file').files[0];if(!file)return;document.querySelectorAll('.card').forEach(el=>el.classList.remove('active'));setVideo(URL.createObjectURL(file),file.name,'Локальный файл открыт только на этом устройстве.');$('file').value='';});
  player.addEventListener('error',()=>{$('status').textContent='Не удалось воспроизвести файл. Проверь подключение или попробуй другой браузер.';});
})();
