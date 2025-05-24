const images = document.querySelectorAll('.fullscreen-image');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const overlayTitle = document.querySelector('.image-overlay h1');
const overlayDesc = document.querySelector('.image-overlay p');
let currentIndex = 0;

function showImage(index) {
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
    
    const currentImage = images[index];
    overlayTitle.textContent = currentImage.dataset.title;
    overlayDesc.textContent = currentImage.dataset.description;
}

showImage(currentIndex);

arrowLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
});

arrowRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        arrowLeft.click();
    } else if (e.key === 'ArrowRight') {
        arrowRight.click();
    }
});