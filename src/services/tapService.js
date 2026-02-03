import axios from 'axios'

const API_URL = 'https://script.google.com/macros/s/AKfycbx7lK-XCQBl6H3H6LwBg6G-icMtuf0KB8hV2kfdlWM460J6tToIbqVkfpCGms767As/exec'

export const tapService = {
  async getTaplist() {
    try {
      const response = await axios.get(`${API_URL}?action=getTaplist`)
      
      // Handle different response formats
      let data = response.data
      
      // If response has a data property, use it
      if (data && data.data && Array.isArray(data.data)) {
        data = data.data
      }
      // If response itself is not an array, try to extract array
      else if (data && !Array.isArray(data)) {
        // Check if it has a property that contains the array
        if (data.taplist && Array.isArray(data.taplist)) {
          data = data.taplist
        } else if (data.result && Array.isArray(data.result)) {
          data = data.result
        } else if (data.taps && Array.isArray(data.taps)) {
          data = data.taps
        } else {
          console.error('Unexpected API response format:', data)
          throw new Error('Invalid API response format')
        }
      }
      
      return data
    } catch (error) {
      console.error('Error fetching taplist:', error)
      throw error
    }
  },

  filterTapsForRow(taps, row) {
    // Ensure taps is an array
    if (!Array.isArray(taps)) {
      console.error('Expected array but got:', taps)
      return []
    }
    
    // Row 1: cols 1-5, Row 2: cols 6-10
    const colRange = row === 1 ? [1, 2, 3, 4, 5] : [6, 7, 8, 9, 10]
    
    return taps
      .filter(tap => tap.is_active === '1' && colRange.includes(parseInt(tap.col)))
      .sort((a, b) => parseInt(a.col) - parseInt(b.col))
  }
}
