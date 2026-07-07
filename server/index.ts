import { createDashboardApp } from './app.js'

const port = Number(process.env.PORT ?? 5174)
const app = createDashboardApp()

app.listen(port, () => {
  console.log(`NovaFlow API running on http://localhost:${port}`)
})
