# OAuth Grade

Announce private personal grading that can be accessed through a Google account

![screenshot](https://i.imgur.com/25Yw8pF.png)

## Usage

1. Nav to [Google API Console](https://console.cloud.google.com/apis/credentials) and acquire an OAuth 2.0 client ID

- Only `auth/userinfo.email` scope is mandatory

2. Rename `src/credential.example.js` to `src/credential.js` with the following content

```javascript
export default {
  GOOGLE_CLIENT_ID: "Client ID from step1",
  GOOGLE_CLIENT_SECRET: "Client secret from step1",
  SESSION_SECRET: "Secret to store sessions",
};
```

3. Rename `src/config.example.js` to `src/config.js` with the following content

```javascript
export default {
  title: "The title of the website",
  grade_path: "The path to the CSV file to read which stores the scores",
  google_callback_url: "https://{your_domain}/auth/google/callback",
};
```

4. Make sure the CSV file is in the path mentioned above. And the format should be (without spacing)

```csv
student_id,      score_title1, score_title2,...
[leave blank],   percentage1,  percentage2,...
your_student_id, score1,       score2...
```

5. Install and launch the application

```bash
npm install
npm start
```

Or via docker-compose

```bash
docker-compose up -d --build
```

The compose script will mount two volumes. One is for the persistent sessions after the restart. The other is for storing grades to read.  
You can update scores without restarting the application.

## License

- MIT
- Author: Yung-Hsiang Hu @ 2022
