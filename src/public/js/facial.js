const video = document.getElementById('video')

Promise.all([
  faceapi.nets.faceLandmark68Net.loadFromUri('/modelos'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/modelos'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/modelos')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', async() => {
  
  const canvas = faceapi.createCanvasFromMedia(video)
  
  const labeledFaceDescriptors = await loadLabeledImages()
  
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  
  document.body.append(canvas)
    
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
    
  setInterval(async () => {
    
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
   
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
    
  }, 100)
})

function loadLabeledImages() {
  const labels = ['darwinpz', 'silviac1924@gmail.com']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i < 2; i++) {
        const img = await faceapi.fetchImage(`../upload/usuarios/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}