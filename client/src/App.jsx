import { useState, useEffect } from 'react'
import axios from 'axios'
import { Rocket, Loader2, CheckCircle, Clock, Download } from 'lucide-react'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://content-marketing-agent-victorion014-qngt7soh.leapcell.dev'

function App() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [launchSuccess, setLaunchSuccess] = useState('')

  // Load history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/history`)
      setHistory(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.log('History load failed', e)
      setHistory([])
    }
  }

  const startRobot = async () => {
    if (!keyword.trim()) return alert('Enter keyword o!')
    setLoading(true)
    setLaunchSuccess('')
    try {
      const res = await axios.post(`${API_URL}/api/start`, {
        keyword: keyword.trim(),
      })
      setLaunchSuccess(res.data?.message || 'Robot launched')
      setKeyword('')
      setTimeout(fetchHistory, 2000)
    } catch (err) {
      alert('Error launching robot — check console')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!selected) return

    if (!Array.isArray(selected.content)) {
      alert('Content not ready yet. Please try again later.')
      return
    }

    const content = selected.content
      .map(
        (d) =>
          `DAY ${d.day}\n${d.title}\n\n${d.meta_description}\n\nTwitter Thread:\n${d.twitter_thread}\n\n---\n`
      )
      .join('\n')

    const blob = new Blob(
      [`30-DAY CONTENT PLAN: ${selected.keyword}\n\n${content}`],
      { type: 'text/plain' }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selected.keyword.replace(/ /g, '_')}_30day_plan.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 flex items-center justify-center gap-4">
            <Rocket className="w-16 h-16 text-yellow-400" />
            30-Day Content Robot
          </h1>
          <p className="text-2xl opacity-90">
            One keyword. 30 days of fire content. Zero stress.
          </p>
        </div>

        {/* LAUNCH SECTION */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl mb-12">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && startRobot()}
            placeholder="e.g. how to make money as Nigerian student"
            className="w-full px-8 py-5 rounded-2xl text-black text-xl mb-8 shadow-lg"
          />

          <button
            onClick={startRobot}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl flex items-center justify-center gap-4 transition transform hover:scale-105"
          >
            {loading ? (
              <>
                Launching Robot <Loader2 className="animate-spin w-8 h-8" />
              </>
            ) : (
              <>START 30-DAY ROBOT</>
            )}
          </button>

          {launchSuccess && (
            <div className="mt-8 p-6 bg-green-600/30 border border-green-400 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" />
              <p className="text-xl font-bold">{launchSuccess}</p>
            </div>
          )}
        </div>

        {/* HISTORY SECTION */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          Your Content Calendars
        </h2>

        {history.length === 0 ? (
          <p className="text-center text-xl opacity-70">
            No calendars yet. Launch your first robot!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((cal) => (
              <div
                key={cal.id}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition"
              >
                <h3 className="text-xl font-bold mb-2 truncate">
                  {cal.keyword}
                </h3>

                <p className="text-sm opacity-80 mb-4">
                  <Clock className="inline w-4 h-4" />{' '}
                  {new Date(cal.created_at).toLocaleString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setSelected({
                        ...cal,
                        content: Array.isArray(cal.content)
                          ? cal.content
                          : [],
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                  >
                    View 30 Days
                  </button>

                  {cal.status === 'completed' &&
                    Array.isArray(cal.content) && (
                      <button
                        onClick={downloadPDF}
                        className="px-4 bg-green-600 hover:bg-green-700 rounded-lg"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                </div>

                <span
                  className={`mt-3 inline-block px-3 py-1 rounded-full text-sm ${
                    cal.status === 'completed'
                      ? 'bg-green-600'
                      : 'bg-yellow-600'
                  }`}
                >
                  {cal.status === 'completed' ? 'Ready' : 'Cooking...'}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-center mt-20 text-sm opacity-60">
          Built by Victor Osaikhuiwuomwan • Live since 2025
        </p>
      </div>
    </div>
  )
}

export default App
