"use strict";

import fs from "fs";
import { parse } from "csv-parse";

export function getGrade(id) {
  const grade_path = "./data/grade.csv";
  return new Promise((resolve, reject) => {
    let lines = 0;
    let title = [];
    let percent = [];
    let return_data = [];
    let stream = fs
      .createReadStream(grade_path)
      .pipe(parse({ delimiter: "," }))
      .on("data", (row) => {
        if (lines == 0) {
          title = row;
        } else if (lines == 1) {
          percent = row;
        }
        /*
         * If the grade of given ID was found,
         * return the result and early terminate the file stream.
         */
        if (row[0] === id) {
          stream.destroy();
          for (let i = 1; i < title.length; i++) {
            return_data.push({
              title: title[i],
              percent: percent[i],
              score: row[i],
            });
          }
        }
        lines++;
      })
      .on("close", () => {
        resolve(return_data);
      })
      .on("error", reject);
  });
}
