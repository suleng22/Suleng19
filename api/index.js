const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { q } = req.query;

    // Cek query
    if (!q) {
      return res.status(400).json({
        status: false,
        message: "Masukkan parameter ?q=judul_lagu"
      });
    }

    // Search YouTube
    const search = await axios.get(
      "https://api.vreden.my.id/api/ytsearch",
      {
        params: {
          query: q
        }
      }
    );

    if (!search.data.result || search.data.result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Video tidak ditemukan"
      });
    }

    const video = search.data.result[0];

    // Download video
    const download = await axios.get(
      "https://api.vreden.my.id/api/ytdl",
      {
        params: {
          url: video.url
        }
      }
    );

    return res.status(200).json({
      status: true,
      creator: "suleng22",
      result: {
        title: video.title,
        author: video.author?.name || "Unknown",
        duration: video.duration || "-",
        thumbnail: video.thumbnail,
        youtube: video.url,
        video: download.data.result?.mp4 || null
      }
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message
    });
  }
};
