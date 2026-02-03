<template>
  <div class="tap-card">
    <div class="tap-header">
      <h2 class="tap-number">TAP <span class="tap-number-highlight">{{ tap.col }}</span></h2>
      <h3 class="beer-name">{{ tap.name }}</h3>
      <div class="beer-info">
        <span v-if="tap.nation" :class="`flag-icon fi fi-${tap.nation}`"></span>
        <span class="beer-detail">{{ tap.detail }}</span>
      </div>
    </div>

    <div class="beer-image-container">
      <img class="beer-image" :src="getImageUrl(tap.image)" :alt="tap.name" @error="handleImageError">
    </div>

    <div v-if="!hidePrice" class="price-container">
      <div :class="tap.cost_big == '0' ? 'price-grid-2' : 'price-grid-3'">
        <div v-if="tap.cost_small != '0'" class="price-item">
          <div class="price-amount">{{ formatPrice(tap.cost_small) }}฿</div>
          <div class="price-details">
            <span class="price-value">{{ tap.value_small }}</span>
            <span class="price-volume">{{ tap.volume_small }}</span>
          </div>
        </div>
        <div v-if="tap.cost != '0'" class="price-item">
          <div class="price-amount">{{ formatPrice(tap.cost) }}฿</div>
          <div class="price-details">
            <span class="price-value">{{ tap.value }}</span>
            <span class="price-volume">{{ tap.volume }}</span>
          </div>
        </div>
        <div v-if="tap.cost_big != '0'" class="price-item">
          <div class="price-amount">{{ formatPrice(tap.cost_big) }}฿</div>
          <div class="price-details">
            <span class="price-value">{{ tap.value_big }}</span>
            <span class="price-volume">{{ tap.volume_big }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TapCard',
  props: {
    tap: {
      type: Object,
      required: true
    },
    hidePrice: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice (price) {
      return parseFloat(price).toLocaleString('th-TH')
    },
    getImageUrl (image) {
      if (!image) return this.getPlaceholderImage()

      // If image is a full URL
      if (image.startsWith('http://') || image.startsWith('https://')) {
        // Check if it's a Google Drive URL and convert it to direct image URL
        if (image.includes('docs.google.com') || image.includes('drive.google.com')) {
          return this.convertGoogleDriveUrl(image)
        }
        return image
      }

      // If image looks like a Google Drive file ID (long alphanumeric string)
      // Typical format: alphanumeric, underscore, hyphen, 25-50 characters
      if (/^[a-zA-Z0-9_-]{25,}$/.test(image)) {
        // Use thumbnail URL which is more reliable for images
        return `https://drive.google.com/thumbnail?id=${image}&sz=w1000`
      }

      // Otherwise, construct the path (for backward compatibility with local files)
      return `./assets/upload/${image}`
    },
    convertGoogleDriveUrl (url) {
      // Extract file ID from various Google Drive URL formats
      let fileId = null

      // Format: https://docs.google.com/uc?export=download&id=FILE_ID
      if (url.includes('id=')) {
        const match = url.match(/id=([^&]+)/)
        if (match) fileId = match[1]
      }
      // Format: https://drive.google.com/file/d/FILE_ID/view
      else if (url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([^/]+)/)
        if (match) fileId = match[1]
      }
      // Format: https://drive.google.com/open?id=FILE_ID
      else if (url.includes('open?id=')) {
        const match = url.match(/open\?id=([^&]+)/)
        if (match) fileId = match[1]
      }

      // If we found a file ID, return the thumbnail URL (more reliable)
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      }

      // If we couldn't parse it, return original URL
      return url
    },
    getPlaceholderImage () {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E'
    },
    handleImageError (event) {
      const currentSrc = event.target.src
      const retryCount = parseInt(event.target.dataset.retryCount || '0')

      // Extract file ID from current URL
      let fileId = null
      const match = currentSrc.match(/id=([^&]+)/)
      if (match) fileId = match[1]

      if (fileId && retryCount < 3) {
        event.target.dataset.retryCount = (retryCount + 1).toString()

        // Try different Google Drive URL formats
        if (retryCount === 0) {
          // Try uc?export=view
          event.target.src = `https://drive.google.com/uc?export=view&id=${fileId}`
        } else if (retryCount === 1) {
          // Try uc?export=download
          event.target.src = `https://drive.google.com/uc?export=download&id=${fileId}`
        } else if (retryCount === 2) {
          // Try uc?id (simple format)
          event.target.src = `https://drive.google.com/uc?id=${fileId}`
        }
        return
      }

      // If all else fails, use placeholder
      event.target.src = this.getPlaceholderImage()
    }
  }
}
</script>

<style scoped>
.tap-card {
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  padding: 1px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 0;
  height: 100%;
  animation: fadeInUp 0.6s ease forwards;
}

.tap-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ba232a, #8c1a1f, #ba232a);
  border-radius: 12px 12px 0 0;
}

.tap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  background: rgba(40, 40, 40, 0.95);
}

.tap-header {
  text-align: center;
  margin-bottom: 4px;
  flex-shrink: 0;
  position: relative;
}

.tap-number {
  position: absolute;
  top: 20px;
  left: -18px;
  background: linear-gradient(135deg, #d42f36 0%, #ba232a 50%, #ba232a 100%);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 800;
  padding: 30px 60px 5px 35px;
  border-radius: 0;
  box-shadow:
    0 4px 15px rgba(186, 35, 42, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  z-index: 10;
  letter-spacing: 0.5px;
  transform: rotate(-43deg);
  transform-origin: left bottom;
  clip-path: polygon(20px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.tap-number::before {
  content: '';
  position: absolute;
  top: 0;
  left: -3px;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  clip-path: polygon(20px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
}

.tap-number::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 15px;
  height: 15px;
  background: linear-gradient(45deg, #8c1a1f, #6b1418);
  transform: rotate(45deg);
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.4),
    inset 1px 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tap-number-highlight {
  color: #ffffff;
  font-weight: 900;
}

.beer-name {
  font-size: 2.0rem;
  font-weight: 800;
  color: #ffffff;
  margin: 25px 0 4px 0;
  line-height: 1.1;
  min-height: 1.8rem;
}

.beer-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
  min-height: 1rem;
  flex-shrink: 0;
}

.flag-icon {
  font-size: 1.6rem;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -8px;
}

.beer-detail {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-top: -6px;
}

.beer-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -12px 0px -38px 0px;
  position: relative;
  min-height: max(30vh, 300px);
  max-height: max(55vh, 550px);
  border-radius: 8px;
  overflow: hidden;
  z-index: 0;
}

.beer-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16.67%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  border-radius: 8px 8px 0 0;
  pointer-events: none;
  z-index: 3;
}

.beer-image-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16.67%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  border-radius: 0 0 8px 8px;
  pointer-events: none;
  z-index: 3;
}

.beer-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  z-index: 1;
}

.price-container {
  margin-top: auto;
  margin-bottom: 10px;
  padding-top: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 4;
  transform: translateY(20px);
}

.price-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}

.price-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
}

.price-item {
  border-radius: 8px;
  padding: 1px 1px;
  text-align: center;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

.price-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);
  background: linear-gradient(135deg, #404040, #2a2a2a);
}

.price-amount {
  font-size: 2.4rem;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  margin-bottom: 0;
  line-height: 0.9;
  margin-top: 6px;
}

.price-details {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: center;
  margin-top: -5px;
}

.price-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ba232a;
  margin-bottom: -5px;
}

.price-volume {
  font-size: 1.44rem;
  font-weight: 800;
  opacity: 0.9;
  color: #ffffff;
  margin-bottom: -5px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive styles */

/* Large Desktop (1920px+) */
@media (min-width: 1920px) {
  .beer-image-container {
    min-height: max(18vh, 220px);
    max-height: max(30vh, 350px);
  }

  .tap-card {
    padding: 12px;
  }
}

/* Desktop (1600px - 1919px) */
@media (min-width: 1600px) and (max-width: 1919px) {
  .beer-image-container {
    min-height: max(16vh, 200px);
    max-height: max(28vh, 320px);
  }
}

/* Desktop (1400px - 1599px) */
@media (min-width: 1400px) and (max-width: 1599px) {
  .beer-image-container {
    min-height: max(15vh, 180px);
    max-height: max(26vh, 300px);
  }
}

/* iPad Pro Landscape & Medium Desktop (1024px - 1200px) */
@media (max-width: 1200px) and (min-width: 1024px) {
  .tap-number {
    font-size: 1.1rem;
    padding: 22px 45px 5px 28px;
    top: 18px;
    left: -16px;
  }

  .beer-name {
    font-size: 1.5rem;
    margin: 20px 0 4px 0;
  }

  .beer-detail {
    font-size: 1rem;
  }

  .price-amount {
    font-size: 1.6rem;
  }

  .price-value {
    font-size: 1.2rem;
  }

  .price-volume {
    font-size: 1.1rem;
  }

  .beer-image-container {
    min-height: max(20vh, 200px);
    max-height: max(40vh, 400px);
  }

  .flag-icon {
    font-size: 1.3rem;
  }

  .price-container {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .price-item {
    padding: 1px 0.5px;
  }
}

/* iPad Landscape & Small Desktop (769px - 1023px) */
@media (max-width: 1023px) and (min-width: 769px) {
  .tap-number {
    font-size: 0.9rem;
    padding: 20px 38px 5px 24px;
    top: 15px;
    left: -14px;
  }

  .beer-name {
    font-size: 1.2rem;
    margin: 18px 0 3px 0;
  }

  .beer-detail {
    font-size: 0.9rem;
  }

  .price-amount {
    font-size: 1.3rem;
  }

  .price-value {
    font-size: 1rem;
  }

  .price-volume {
    font-size: 0.9rem;
  }

  .beer-image-container {
    min-height: max(18vh, 180px);
    max-height: max(35vh, 320px);
    margin: 0px 0px 0px 0px;
  }

  .flag-icon {
    font-size: 1.2rem;
  }

  .tap-card {
    padding: 6px;
  }

  .price-container {
    margin-top: 1px;
    margin-bottom: 20px;
  }

  .price-item {
    padding: 1px 0.5px;
  }
}

/* iPad Portrait (481px - 768px) */
@media (max-width: 768px) and (min-width: 481px) {
  .tap-card {
    padding: 10px;
    height: auto;
    min-height: 380px;
    display: flex;
    flex-direction: column;
  }

  .tap-number {
    font-size: 0.9rem;
    padding: 18px 35px 5px 22px;
    top: 12px;
    left: -12px;
  }

  .beer-name {
    font-size: 1.2rem;
    margin: 16px 0 6px 0;
    min-height: auto;
    line-height: 1.2;
  }

  .beer-detail {
    font-size: 0.9rem;
  }

  .price-amount {
    font-size: 1.3rem;
    margin-top: 8px;
  }

  .price-value {
    font-size: 1rem;
  }

  .price-volume {
    font-size: 0.9rem;
  }

  .flag-icon {
    font-size: 1.2rem;
  }

  .beer-image-container {
    min-height: 200px;
    max-height: 250px;
    height: auto;
    margin: 10px 0;
    aspect-ratio: 4/3;
    position: relative;
  }
  
  .beer-image {
    object-fit: contain;
  }

  .price-container {
    margin-bottom: 10px;
    margin-top: auto;
  }
}

/* Mobile Landscape & Small Tablet (376px - 480px) */
@media (max-width: 480px) and (min-width: 376px) {
  .tap-card {
    padding: 12px;
    height: auto;
    min-height: auto;
  }

  .tap-number {
    font-size: 0.8rem;
    padding: 15px 40px 4px 18px;
    top: 10px;
    left: -8px;
  }

  .beer-name {
    font-size: 1.1rem;
    margin: 14px 0 4px 0;
    min-height: auto;
  }

  .beer-detail {
    font-size: 0.8rem;
  }

  .price-amount {
    font-size: 1.2rem;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .price-value {
    font-size: 0.9rem;
    margin-top: 4px;
    margin-bottom: 2px;
  }

  .price-volume {
    font-size: 0.8rem;
    margin-top: 4px;
    margin-bottom: 2px;
  }

  .flag-icon {
    font-size: 1rem;
  }

  .beer-image-container {
    width: 100%;
    height: 350px;
    min-height: 350px;
    max-height: none;
    margin: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .beer-image {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .price-container {
    margin-bottom: 10px;
  }
}

/* Mobile Portrait (max 375px) */
@media (max-width: 375px) {
  .tap-card {
    padding: 8px;
    height: auto;
    min-height: auto;
  }

  .tap-number {
    font-size: 0.7rem;
    padding: 12px 25px 4px 15px;
    top: 8px;
    left: -8px;
  }

  .beer-name {
    font-size: 0.9rem;
    margin: 12px 0 4px 0;
    min-height: auto;
  }

  .beer-detail {
    font-size: 0.7rem;
  }

  .price-amount {
    font-size: 1rem;
    margin-top: 8px;
    margin-bottom: 4px;
  }

  .price-value {
    font-size: 0.8rem;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .price-volume {
    font-size: 0.7rem;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .flag-icon {
    font-size: 0.9rem;
  }

  .beer-image-container {
    width: 100%;
    height: 300px;
    min-height: 300px;
    max-height: none;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .beer-image {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .price-container {
    margin-bottom: 10px;
    padding-top: 6px;
  }

  .price-item {
    padding: 2px;
  }
}

/* Height-based adjustments for landscape orientations */
@media (max-height: 800px) and (min-width: 769px) {
  .beer-image-container {
    min-height: max(12vh, 100px);
    max-height: max(20vh, 140px);
  }

  .tap-number {
    font-size: 0.7rem;
    padding: 14px 28px 4px 16px;
    top: 9px;
    left: -11px;
  }

  .beer-name {
    font-size: 0.85rem;
    min-height: 1.3rem;
    margin: 15px 0 3px 0;
  }

  .price-amount {
    font-size: 1rem;
  }
}

@media (max-height: 700px) and (min-width: 769px) {
  .beer-image-container {
    min-height: max(10vh, 80px);
    max-height: max(40vh, 120px);
  }

  .tap-number {
    font-size: 0.65rem;
    padding: 12px 40px 5px 16px;
    top: 14px;
    left: -4px;
  }

  .beer-name {
    font-size: 0.8rem;
    min-height: 1.1rem;
    margin: 13px 0 2px 0;
  }

  .beer-detail {
    font-size: 0.7rem;
  }

  .price-amount {
    font-size: 0.9rem;
  }

  .price-value {
    font-size: 0.8rem;
  }

  .price-volume {
    font-size: 0.7rem;
  }
}

@media (max-height: 600px) and (min-width: 769px) {
  .beer-image-container {
    min-height: max(20vh, 60px);
    max-height: max(40vh, 100px);
  }

  .tap-number {
    font-size: 0.55rem;
    padding: 10px 22px 3px 12px;
    top: 6px;
    left: -8px;
  }

  .beer-name {
    font-size: 0.7rem;
    min-height: 0.9rem;
    margin: 10px 0 2px 0;
  }

  .beer-detail {
    font-size: 0.6rem;
  }

  .price-amount {
    font-size: 0.75rem;
  }

  .price-value {
    font-size: 0.65rem;
  }

  .price-volume {
    font-size: 0.6rem;
  }

  .price-container {
    margin-bottom: 3px;
    padding-top: 4px;
  }
}

/* Mobile Landscape Specific (max-height 500px) */
@media (max-height: 500px) {
  .tap-card {
    padding: 6px;
    display: flex;
    flex-direction: column;
  }

  .beer-image-container {
    height: auto;
    min-height: 100px;
    max-height: 160px;
    margin: 4px 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .beer-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .beer-name {
    font-size: 0.8rem;
    margin: 6px 0 2px 0;
    min-height: auto;
    line-height: 1.1;
  }

  .tap-number {
    font-size: 0.6rem;
    padding: 12px 30px 4px 18px;
    top: 8px;
    left: -10px;
  }

  .price-container {
    margin-top: 0;
    margin-bottom: 4px;
    padding-top: 2px;
    transform: none;
  }

  .price-amount {
    font-size: 0.9rem;
    margin-top: 2px;
    margin-bottom: 0;
  }
  
  .price-value, .price-volume {
    font-size: 0.65rem;
    margin-bottom: 0;
  }
  
  .price-item {
    padding: 1px;
  }
  
  .beer-detail {
    font-size: 0.6rem;
  }
  
  .flag-icon {
    font-size: 0.8rem;
  }
}
</style>
