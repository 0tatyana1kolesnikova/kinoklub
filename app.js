(() => {
  const $ = id => document.getElementById(id);
  const player=$('player'), library=$('library'), loading=$('loading');
  const movies=Array.isArray(window.MOVIES)?window.MOVIES:[];
  let objectUrl=null, generation=0;
  $('count').textContent=movies.length;
  function setVideo(url,title,description){
    player.pause(); if(objectUrl) URL.revokeObjectURL(objectUrl); objectUrl=url.startsWith('blob:')?url:null;
    player.src=url; player.hidden=false; $('placeholder').hidden=true; $('title').textContent=title;
    $('status').textContent=description||'Видео готово к просмотру.'; player.load();
  }
  function card(movie){
    const button=document.createElement('button'); button.type='button'; button.className='card';
    const thumb=document.createElement('span'); thumb.className='thumb'; thumb.textContent='▶';
    const text=document.createElement('span'); text.className='card-text';
    const title=document.createElement('strong'); title.textContent=movie.title;
    const desc=document.createElement('small'); desc.textContent=movie.description||'Смотреть видео';
    text.append(title,desc); button.append(thumb,text);
    button.addEventListener('click',async()=>{
      const current=++generation; document.querySelectorAll('.card').forEach(el=>el.classList.remove('active')); button.classList.add('active');
      loading.hidden=false; $('title').textContent=movie.title; $('status').textContent='Загружаем видео. Это может занять некоторое время.';
      try{
        const parts=[];
        for(let i=0;i<movie.parts.length;i++){
          $('progress').textContent=`Часть ${i+1} из ${movie.parts.length}`;
          const response=await fetch(movie.parts[i]); if(!response.ok) throw Error(`Ошибка загрузки (${response.status})`);
          parts.push(await response.blob()); if(current!==generation)return;
        }
        setVideo(URL.createObjectURL(new Blob(parts,{type:movie.type||'video/mp4'})),movie.title,'Видео загружено. Нажми ▶, чтобы начать просмотр.');
      }catch(e){if(current===generation) $('status').textContent='Не удалось загрузить видео. Проверь подключение к интернету и открой сайт через интернет или локальный сервер.';}
      finally{if(current===generation)loading.hidden=true;}
    }); return button;
  }
  movies.forEach(movie=>library.append(card(movie)));
  $('pick').addEventListener('click',()=>$('file').click());
  $('file').addEventListener('change',()=>{const file=$('file').files[0];if(!file)return;generation++;loading.hidden=true;document.querySelectorAll('.card').forEach(el=>el.classList.remove('active'));setVideo(URL.createObjectURL(file),file.name,'Локальный файл открыт только на этом устройстве.');$('file').value='';});
  player.addEventListener('error',()=>{$('status').textContent='Не удалось воспроизвести файл. Возможно, браузер не поддерживает формат видео.';});
})();
