const levels = document.querySelectorAll('.level');
const audio = document.getElementById('audio');

window.levels = levels;

window.addEventListener('load', function() {
  for(var i = 0; i < levels.length; i++) {
    levels[i].style.transform = " translateZ(" + i * 10 + "vmin)";
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(audioCtx.destination);
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var currentStage = 0;
  var total = 0;
  var rms = 0;
  var decibel = 0;
  var stagePercentSize = 100 / levels.length;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    total = 0;
    analyser.getByteFrequencyData(frequencyData);
    for(var i = 0; i < frequencyData.length; i++) {
      total += Math.abs(frequencyData[i]);
    }
    rms = Math.sqrt(total / (frequencyData.length / 2));
    // TODO: Calculate max rms to be accurate
    //decibel = 20 * (Math.log(rms) / Math.log(10));
    currentStage = Math.ceil(((rms / 18) * 100) / stagePercentSize) - 1; // change stage from min 1 to min 0 for indexing
    if(currentStage > levels.length -1) currentStage = levels.length -1;

    levels[currentStage].classList.add('active');
    for(var i = 0; i < levels.length; i++) {
      if(i == currentStage) continue;
      if(levels[i].classList.contains('active')) levels[i].classList.remove('active');
    }
    //console.log(currentStage);
  }

  renderFrame();
});

