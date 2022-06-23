"use strict";

import fs from "fs";
import { parse } from "csv-parse";

export function getGrade(id) {
  const grade_path = "./data/grade.csv";
  return new Promise((resolve, reject) => {
    let lines = 0;
    let return_data = {
      title: [],
      percent: [],
      grade: [],
    };
    let stream = fs
      .createReadStream(grade_path)
      .pipe(parse({ delimiter: "," }))
      .on("end", () => {
        if (return_data.grade.length === 0) resolve([]);
      })
      .on("data", (row) => {
        if (lines == 0) {
          return_data.title = row;
        } else if (lines == 1) {
          return_data.percent = row;
        }
        if (row[0] === id) {
          stream.destroy();
          return_data.grade = row;
          resolve(return_data);
        }
        lines++;
      })
      .on("error", reject);
  });
}
