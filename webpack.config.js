import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.svg']
  },
  devServer: {
    port: 9500,
    static: ['./public'],
    open: false,
    hot: false,
    liveReload: true,
    /* This forces dev server sockets to disconnect. */
    // client: {
    //   webSocketURL: 'ws://localhost:3000',
    // }
    /* NOTE: still, there's an error ERR_CONNECTION_REFUSED thrown on every auto-rebuild, though the app renders correctly. */
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use:  'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ]
  }
}
