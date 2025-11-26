// Global state for managing focus
let focusedRing = null;
let isAnimating = false;

// Ring metadata
const ringMetadata = {
  'ring1': {
    name: 'Golden Elegance',
    description: 'A timeless 18K gold ring with classic craftsmanship. Perfect for those who appreciate traditional elegance and refined taste.',
    color: '#FFD700'
  },
  'ring2': {
    name: 'Platinum Grace',
    description: 'Sophisticated platinum band with a mirror-like finish. A symbol of eternal beauty and premium luxury craftsmanship.',
    color: '#C0C0C0'
  },
  'ring3': {
    name: 'Ruby Passion',
    description: 'Exquisite rose gold with vibrant crimson accents. An enchanting piece that captures warmth and romantic elegance.',
    color: '#FF6347'
  }
};

// Close button element
const closeButton = document.getElementById('close-button');
const descriptionPanel = document.getElementById('ring-description');

// ring-focus component
AFRAME.registerComponent('ring-focus', {
  schema: {
    originalPosition: {type: 'vec3'},
    originalScale: {type: 'vec3'}
  },

  init: function() {
    this.el.addEventListener('click', this.onClick.bind(this));
    this.el.addEventListener('mouseenter', this.onHover.bind(this));
    this.el.addEventListener('mouseleave', this.onHoverOut.bind(this));
    this.data.originalPosition = this.el.getAttribute('position').clone();
    this.data.originalScale = this.el.getAttribute('scale') || {x: 1, y: 1, z: 1};
  },

  onHover: function() {
    if (!focusedRing) {
      this.el.setAttribute('scale', {x: 1.1, y: 1.1, z: 1.1});
      this.el.setAttribute('material', {emissive: this.el.getAttribute('material').color, emissiveIntensity: 0.3});
    }
  },

  onHoverOut: function() {
    if (!focusedRing) {
      this.el.setAttribute('scale', {x: 1, y: 1, z: 1});
      this.el.setAttribute('material', {emissiveIntensity: 0});
    }
  },

  onClick: function() {
    if (isAnimating || focusedRing) return;

    focusedRing = this.el;
    isAnimating = true;

    // Show description
    const ringId = this.el.id;
    const metadata = ringMetadata[ringId];
    if (metadata && descriptionPanel) {
      descriptionPanel.innerHTML = `<h4>${metadata.name}</h4><p>${metadata.description}</p>`;
      descriptionPanel.style.display = 'block';
    }

    // Animate to focus position
    const focusPosition = {
      x: this.data.originalPosition.x,
      y: this.data.originalPosition.y + 0.5,
      z: this.data.originalPosition.z - 0.5
    };
    const focusScale = {x: 1.8, y: 1.8, z: 1.8};

    this.animateTo(focusPosition, focusScale, () => {
      isAnimating = false;
      closeButton.style.display = 'block';
      // Add glow effect
      this.el.setAttribute('material', {emissiveIntensity: 0.4});
    });
  },

  animateTo: function(targetPosition, targetScale, callback) {
    const duration = 1200; // 1.2 seconds for smoother animation
    const startPosition = this.el.getAttribute('position');
    const startScale = this.el.getAttribute('scale') || {x: 1, y: 1, z: 1};
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * easeProgress,
        y: startPosition.y + (targetPosition.y - startPosition.y) * easeProgress,
        z: startPosition.z + (targetPosition.z - startPosition.z) * easeProgress
      };

      const currentScale = {
        x: startScale.x + (targetScale.x - startScale.x) * easeProgress,
        y: startScale.y + (targetScale.y - startScale.y) * easeProgress,
        z: startScale.z + (targetScale.z - startScale.z) * easeProgress
      };

      this.el.setAttribute('position', currentPosition);
      this.el.setAttribute('scale', currentScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };

    animate();
  },

  returnToOriginal: function(callback) {
    this.el.setAttribute('material', {emissiveIntensity: 0});
    this.animateTo(this.data.originalPosition, this.data.originalScale, () => {
      focusedRing = null;
      closeButton.style.display = 'none';
      descriptionPanel.style.display = 'none';
      if (callback) callback();
    });
  }
});

// drag-rotate component
AFRAME.registerComponent('drag-rotate', {
  schema: {
    sensitivity: {type: 'number', default: 0.01}
  },

  init: function() {
    this.isDragging = false;
    this.startX = 0;
    this.currentRotation = 0;

    this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.el.addEventListener('touchstart', this.onTouchStart.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
  },

  onMouseDown: function(event) {
    if (focusedRing !== this.el) return;
    this.isDragging = true;
    this.startX = event.clientX;
  },

  onTouchStart: function(event) {
    if (focusedRing !== this.el) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
  },

  onMouseMove: function(event) {
    if (!this.isDragging) return;
    const deltaX = event.clientX - this.startX;
    this.rotate(deltaX);
  },

  onTouchMove: function(event) {
    if (!this.isDragging) return;
    event.preventDefault();
    const deltaX = event.touches[0].clientX - this.startX;
    this.rotate(deltaX);
  },

  rotate: function(deltaX) {
    this.currentRotation += deltaX * this.data.sensitivity;
    this.el.setAttribute('rotation', {x: 0, y: this.currentRotation, z: 0});
  },

  onMouseUp: function() {
    this.isDragging = false;
  },

  onTouchEnd: function() {
    this.isDragging = false;
  }
});

// Close button event
closeButton.addEventListener('click', () => {
  if (focusedRing && !isAnimating) {
    isAnimating = true;
    focusedRing.components['ring-focus'].returnToOriginal(() => {
      isAnimating = false;
    });
  }
});

