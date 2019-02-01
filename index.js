window.addEventListener('load', () => {
  const player = getSelector('.player');
  const audio = getSelector('audio', player);
  const playList = getSelector('.play_list');

  const controll = getSelector('.controll');
  const autoplayBtn = getSelector('.autoplay-btn', controll);
  const loopBtn = getSelector('.loop-btn', controll);

  // next & prev
  const prevBtn = getSelector('.prev-btn', controll);
  const nextBtn = getSelector('.next-btn', controll);

  // init 
  fetch('./store.json')
    .then(response => response.json())
    .then((store) => {
      SetPlayList(store, playList)
      SetTrack(getSelector('audio', player), `store/${store[0].original}`)
      ChangeTrack(getSelectorAll('li', playList), playList, SetTrack);
      Listener(audio, 'autoplay', autoplayBtn);
      Listener(audio, 'loop', loopBtn);

      NextPrev(prevBtn, "prev");
      NextPrev(nextBtn, "next");

      autoplayBtn.addEventListener('click', ()=> {
        loopBtn.classList.contains('active') ? loopBtn.classList.remove('active') : null;
      })

      loopBtn.addEventListener('click', ()=> {
        audio.hasAttribute('autoplay') ? audio.removeAttribute('autoplay') : null;
        autoplayBtn.classList.contains('active') ? autoplayBtn.classList.remove('active') : null;
      } )

    });

  // autoplay next track
  audio.addEventListener("ended", () => {
    if (audio.hasAttribute('autoplay') && !audio.hasAttribute('loop')) {
      const list = getSelector('.play_list')
      const activeTrack = getSelector('li.active', list)
      const listAll = getSelectorAll('li', list)

      const firstTrack = listAll[0];

      if (activeTrack.nextElementSibling) {
        activeTrack.nextElementSibling.classList.add("active")
        GetTrack(activeTrack.nextElementSibling)
      } else {
        firstTrack.classList.add("active")
        GetTrack(firstTrack)
      }

      activeTrack.classList.remove("active")
    }
  });

})

const SetTrack = (element, track) => {
  typeof element.childNodes[0] !== "undefined" ? element.children[0].remove() : null
  const source = document.createElement('source');
  source.src = track;
  source.type = "audio/mpeg";
  element.appendChild(source)
  element.load()
}

const SetPlayList = (array, parrent) => {
  const UL = document.createElement('ul');
  array.forEach((element, i) => {
    const LI = document.createElement('li')
    i === 0 ? LI.className = 'active' : null
    LI.innerHTML = element.track;
    LI.setAttribute('original', element.original);
    UL.appendChild(LI)
  });
  parrent.appendChild(UL);
}

const ChangeTrack = (playList, parent, callback) => {
  playList.forEach(elem => {
    elem.addEventListener('click', () => {
      getSelector('.active', parent).classList.remove("active")
      elem.classList.add("active")
      const origin = elem.getAttribute('original')
      callback(getSelector('audio', getSelector('.player')), `store/${origin}`);
    })
  })
}

const Listener = (audio, nameEvent, elem) => {
  elem.addEventListener('click', e => {
    const target = e.target;
    target.classList.toggle('active')
    audio.hasAttribute(nameEvent) ? audio.removeAttribute(nameEvent) : audio.setAttribute(nameEvent, '')
    audio.hasAttribute(nameEvent) ? audio.play() : audio.pause() 
  });
}

const NextPrev = (element, sibling) => {
  element.addEventListener('click', e => {
    const player = getSelector('.player');
    const audio = getSelector('audio', player);

    const list = getSelector('.play_list')
    const activeTrack = getSelector('li.active', list)
    const listAll = getSelectorAll('li', list)

    const firstTrack = listAll[0];
    const listTrack = listAll[listAll.length - 1];

    if (sibling === 'next') {
      if (activeTrack.nextElementSibling) {
        activeTrack.nextElementSibling.classList.add("active")
        GetTrack(activeTrack.nextElementSibling)
      } else {
        firstTrack.classList.add("active")
        GetTrack(firstTrack)
      }
    }

    if (sibling === 'prev') {
      if (activeTrack.previousElementSibling) {
        activeTrack.previousElementSibling.classList.add("active")
        GetTrack(activeTrack.previousElementSibling)
      } else {
        listTrack.classList.add("active")
        GetTrack(listTrack)
      }
    }

    activeTrack.classList.remove("active")

    audio.pause();

    setTimeout( () => audio.play(), 300 )

  });
};


const GetTrack = element => {
  const plaer = getSelector('.player');
  const origin = element.getAttribute('original');
  SetTrack(getSelector('audio', plaer), `store/${origin}`)
}