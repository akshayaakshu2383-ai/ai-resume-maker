const { YoutubeTranscript } = require('youtube-transcript');
const videoId='jNQXAC9IVRw';
YoutubeTranscript.fetchTranscript(videoId)
  .then(t=>{
    console.log('Transcript length', t.length);
    console.log(t.slice(0,3));
  })
  .catch(e=>{console.error('err', e.message);});
