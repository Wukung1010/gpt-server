import express from 'express'
import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
  apiKey: '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',
})
const openai = new OpenAIApi(config)

const port = 8080
const app = express()

app.post('/ask', async (req, res) => {
  const q = req.body.q || ''
  if (q.trim().length === 0) {
    res.status(400).json({
      error: {
        message: '请输入有效的问题',
      },
    })
  }
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: q,
      temperature: 0.5,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: ['\n'],
    })
    res.status(200).json({
      result: completion.data.choices[0].text,
    })
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`request出错了: ${error.message}`)
      res.status(500).json({
        error: {
          message: '服务器报错了',
        },
      })
    }
  }
})

app.listen(port)
