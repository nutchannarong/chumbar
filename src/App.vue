<template>
  <div class="container-fluid">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadTaps" class="retry-button">ลองอีกครั้ง</button>
    </div>

    <div v-else class="tap-grid">
      <!-- Row 1: TAPs 1-5 -->
      <div class="tap-row">
        <TapCard 
          v-for="tap in row1Taps" 
          :key="tap.col" 
          :tap="tap"
          :hidePrice="hidePrice"
          :style="{ animationDelay: `${(parseInt(tap.col) - 1) * 0.1}s` }"
        />
      </div>

      <!-- Row 2: TAPs 6-10 -->
      <div class="tap-row">
        <TapCard 
          v-for="tap in row2Taps" 
          :key="tap.col" 
          :tap="tap"
          :hidePrice="hidePrice"
          :style="{ animationDelay: `${(parseInt(tap.col) - 6) * 0.1}s` }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import TapCard from './components/TapCard.vue'
import { tapService } from './services/tapService'

export default {
  name: 'App',
  components: {
    TapCard
  },
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const row1Taps = ref([])
    const row2Taps = ref([])

    // Check if URL path is /show (hide prices)
    const hidePrice = computed(() => {
      return window.location.pathname === '/show'
    })

    const loadTaps = async () => {
      try {
        loading.value = true
        error.value = null
        
        const data = await tapService.getTaplist()
        
        // Filter taps for each row
        row1Taps.value = tapService.filterTapsForRow(data, 1)
        row2Taps.value = tapService.filterTapsForRow(data, 2)
        
        loading.value = false
      } catch (err) {
        console.error('Failed to load taps:', err)
        error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
        loading.value = false
      }
    }

    // Auto-refresh every 5 minutes
    // const setupAutoRefresh = () => {
    //   setInterval(() => {
    //     loadTaps()
    //   }, 5 * 60 * 1000) // 5 minutes
    // }

    onMounted(() => {
      loadTaps()
      // setupAutoRefresh()
    })

    return {
      loading,
      error,
      row1Taps,
      row2Taps,
      loadTaps,
      hidePrice
    }
  }
}
</script>

<style scoped>
.container-fluid {
  height: 100vh;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.tap-grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 100vh;
}

.tap-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  flex: 1;
  min-height: 0;
}

.loading-container,
.error-container {
  text-align: center;
  color: #ffffff;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-button {
  margin-top: 20px;
  padding: 10px 30px;
  background: linear-gradient(135deg, #ff8e53 0%, #ed4e16 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

/* Mobile Responsive */
@media (max-width: 1024px) and (min-width: 769px) {
  .tap-row {
    gap: 3px;
  }
  .container-fluid {
    padding: 6px;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
  .tap-grid {
    height: auto;
    min-height: 100%;
    overflow-y: visible;
  }
}

/* Tablet Portrait & Mobile - Show all rows with scrolling */
@media (max-width: 768px) and (min-width: 481px) {
  .tap-grid {
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    max-height: 100vh;
    padding-bottom: 20px;
  }
  .tap-row {
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    flex: none;
    min-height: auto;
  }
  .tap-row:nth-child(2) {
    display: grid;
  }
  .container-fluid {
    padding: 10px;
    align-items: flex-start;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
}

/* Mobile - Single column layout */
@media (max-width: 480px) {
  .tap-grid {
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    max-height: none;
    height: auto;
    padding-bottom: 20px;
  }
  .tap-row {
    grid-template-columns: 1fr;
    gap: 12px;
    flex: none;
    min-height: auto;
  }
  .tap-row:nth-child(2) {
    display: grid;
  }
  .container-fluid {
    padding: 12px;
    align-items: flex-start;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
}

@media (max-height: 800px) {
  .container-fluid {
    padding: 6px;
  }
  .tap-grid {
    gap: 6px;
  }
  .tap-row {
    gap: 6px;
  }
}

@media (max-height: 700px) {
  .container-fluid {
    padding: 4px;
  }
  .tap-grid {
    gap: 4px;
  }
  .tap-row {
    gap: 4px;
  }
}
</style>
