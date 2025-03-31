// stores/modules/article.js
import { defineStore } from 'pinia'

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    data: {
      aiAnalysisSummary: '',
      aiProbability: 0,
      aiReasoning: '',
      analysisId: 0,
      analyzedAt: '',
      articleId: 0,
      authenticityProbability: 0,
      author: '',
      hotWords: [
        {
          score: 0,
          word: ''
        }
      ],
      model: '',
      wordCount: 0
    },
    message: '',
    token: ''
  }),
  actions: {
    setData(analysisData) {
      this.data = analysisData.data
      this.message = analysisData.message
      this.token = analysisData.token
    }
  }
})
