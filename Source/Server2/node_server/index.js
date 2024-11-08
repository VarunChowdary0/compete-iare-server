const axios = require('axios');
const express = require('express');
// const url = "http://127.0.0.1:5000/";
const url = "https://iare-compete-python-scrapper.vercel.app/";
const morgan = require('morgan')
const turso = require('./db/config')
const cors = require('cors')
const app = express();

const {v4: uuidv4 } = require('uuid');

//

app.use(cors({
    origin: ['https://compete-iare.vercel.app', 'http://localhost:3000'], // allow Vercel and localhost
    methods: ['GET', 'POST'],
  }));
  
app.use(express.json())
app.use(morgan('dev'))

let lc_fakes = []

let fails = {
    lc : [],
    cc : [],
    gfg : [],
    hrc : []
}
const get_CodeChef = (username) => {
    console.log("CodeChef:",username);
    return axios.post(url + "test_url_cc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching CodeChef data:",err.message);
            fails.cc.push(username)
            console.log(username,"Failed")
            return {}; 
        }); 
};

const get_LeetCode = (username) => {
    // console.log("LeetCode");
    return axios.post(url + "test_url_lc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching LeetCode data:", err.message);
            lc_fakes.push(username);
            fails.lc.push(username)
            return {
                "name": 'null',
                "problemsSolved": {
                    "All": -1,
                    "Easy": -1,
                    "Hard": -1,
                    "Medium": -1
                },
                "username": username
                }; 
        });
};

const get_GeekForGeeks = (username) => {
    return axios.post(url + "test_url_gfg", { username:username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching GFG data:", err.message);
            fails.gfg.push(username)
            return {};  
        });
};

const get_HackerRank = (username) => {
    // console.log("HackerRank");
    return axios.post(url + "test_url_hrc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching HackerRank data:", err.message);
            fails.hrc.push(username)
            return {};  
        });
};


app.get('/lc_fakes',(req,res)=>{
    console.log(lc_fakes,fails)
    res.status(200).json({lc_fakes,fails});
})
const scrap_function = (usernames,idx) => {
    // Check if LeetCode username is not empty
    if (usernames.leetcode) {
        const data_leet = get_LeetCode(usernames.leetcode);
        Promise.resolve(data_leet)
            .then((res) => {
                const name = res.name || '';
                const easy = res.problemsSolved.Easy || 0;
                const medium = res.problemsSolved.Medium || 0;
                const hard = res.problemsSolved.Hard || 0;
                const user = usernames.leetcode || '';
                turso.execute({
                    sql: `UPDATE LeetCode SET Name = :name, EasyProblemSolved = :easy, 
                            MediumProblemSolved = :medium, HardProblemSolved = :hard WHERE username = :user;`,
                    args: { name, easy, medium, hard, user }
                })
                .then((result) => {
                    console.log(idx," - LeetCode ",usernames.leetcode," Updated Successfully. Progress : 1/4 ");
                    // Check if CodeChef username is not empty
                })
                .catch((err) => {
                    console.error("LeetCode Update Failed:", err);
                });
            })
            .catch((err) => {
                console.error("Error fetching LeetCode data:", err);
            });
    }
    else{
        console.log(usernames.RollNumber+"No LeetCode account ?")
    }

    if (usernames.gfg) {
        const data_gfg = get_GeekForGeeks(usernames.gfg);
        Promise.resolve(data_gfg)
            .then((res12) => {
                const collegeName = res12.college || '';
                const rank = res12.Rank || null;
                const problemSolved = res12.problems_solved || 0;
                const contestRating = res12.contest_rating || 0;
                const score = res12.score || 0;
                const user = usernames.gfg || '';
                turso.execute({
                    sql: `UPDATE GeekForGeeks SET CollegeName = :collegeName, Rank_ = :rank, 
                        ProblemSolved = :problemSolved, ContestRating = :contestRating, 
                        Score = :score WHERE Username = :user;`,
                    args: { collegeName, rank, problemSolved, contestRating, score, user }
                })
                .then((res_12) => {
                    console.log(idx," - GeekForGeeks ",usernames.gfg," Updated Successfully. Progress: 3/4");
                    // Check if HackerRank username is not empty
                    
                })
                .catch((err12) => {
                    console.log(err12);
                });
            })
            .catch((err1) => {
                console.log(err1);
            });
    } else{
        console.log(usernames.RollNumber+"No GFG account ?")
    }

    if (usernames.hackerrank) {
        const data_hacker_rank = get_HackerRank(usernames.hackerrank);
        Promise.resolve(data_hacker_rank)
            .then((res123) => {
                console.log(res123);
                const name = res123.name || '';
                const oneStarBadge = res123.badges.oneStarBadge || 0;
                const twoStarBadge = res123.badges.twoStarBadge || 0;
                const threeStarBadge = res123.badges.threeStarBadge || 0;
                const fourStarBadge = res123.badges.fourStarBadge || 0;
                const fiveStarBadge = res123.badges.fiveStarBadge || 0;
                const advancedCert = res123.certificates.advanced || 0;
                const intermediateCert = res123.certificates.intermediate || 0;
                const basicCert = res123.certificates.basic || 0;
                const user = usernames.hackerrank || '';
                turso.execute({
                    sql: `UPDATE HackerRank SET Name = :name, oneStarBadge = :oneStarBadge, 
                        twoStarBadge = :twoStarBadge, threeStarBadge = :threeStarBadge, 
                        fourStarBadge = :fourStarBadge, fiveStarBadge = :fiveStarBadge, 
                        AdvancedCertifications = :advancedCert, IntermediateCertifications = :intermediateCert, 
                        BasicCertifications = :basicCert WHERE Username = :user;`,
                    args: { name, oneStarBadge, twoStarBadge, threeStarBadge, 
                            fourStarBadge, fiveStarBadge, advancedCert, 
                            intermediateCert, basicCert, user }
                })
                .then((res1234) => {
                    console.log(idx," - HackerRank ",usernames.hackerrank," Updated Successfully. Progress: 4/4");
                })
                .catch((Err1234) => {
                    console.log(Err1234);
                });
            })
            .catch((err123) => {
                console.log(err123);
            });
    }
    else{
        console.log(usernames.RollNumber+"No HackerRank account ?")
    }

     // if (usernames.codechef) {
    //     const data_codechef = get_CodeChef(usernames.codechef);
    //     Promise.resolve(data_codechef)
    //         .then((res1) => {
    //             const name = res1.name || '';
    //             const contests = res1.contests || 0;
    //             const problemSolved = res1['problems-Solved'] || 0;
    //             const user = usernames.codechef || '';
    //             turso.execute({
    //                 sql: `UPDATE CodeChef SET Name = :name, Contests = :contests, 
    //                     ProblemSolved = :problemSolved WHERE Username = :user;`,
    //                 args: { name, contests, problemSolved, user }
    //             })
    //             .then((res_1) => {
    //                 // if(usernames.codechef === 'varun9392'){
    //                 //     console.log(res_1.columns)
    //                 // }
    //                 console.log(idx," - CodeChef ",usernames.codechef," Updated Successfully. Progress: 2/4");
    //                 // Check if GeekForGeeks username is not empty
                    
    //             })
    //             .catch((err1) => {
    //                 console.log(err1);
    //             });
    //         })
    //         .catch((err1) => {
    //             console.log(err1);
    //         });
    // }
    // else{
    //     console.log(usernames.RollNumber+"No CodeChef account ?")
    // }

};



app.get("/", (req, res) => {
    const usernames = {
        leetcode: "varun_chowdary99",
        gfg: "saivarunchowdary",
        codechef: "varun9392",
        hackerrank: "saivarunchowdar2"
    };
    const leetcodePromise = get_LeetCode(usernames.leetcode);
    const codechefPromise = get_CodeChef(usernames.codechef);
    const hackerrankPromise = get_HackerRank(usernames.hackerrank);
    const gfgPromise = get_GeekForGeeks(usernames.gfg);

    Promise.all([leetcodePromise, codechefPromise, hackerrankPromise, gfgPromise])
        .then((results) => {
            const studentData = {
                name: "Polusasu Sai Varun",
                roll: "22951A05G8",
                ScoreData: {
                    leetcode: results[0],
                    codechef: results[1],
                    hackerrank: results[2],
                    geekforgeeks: results[3]
                }
            };
            res.status(200).json(studentData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("An error occurred while fetching data.");
        });

        axios.get(url)
        .then((resp0)=>{
            console.log("failed:",resp0.data);
            if(resp0.length > 10){
                update_failed_cc(resp0.data)
            }
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.get("/update_all", (req, res) => {
    const startTime = Date.now(); 
    turso.execute(`
        SELECT 
            sd.RollNumber,
            sd.Name,
            lc.Username AS leetcode,
            cc.Username AS codechef,
            hr.Username AS hackerrank,
            gfg.Username AS gfg
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        GROUP BY 
            sd.RollNumber, sd.Name, lc.Username, cc.Username, hr.Username, gfg.Username;
    `)
    .then((queryResult) => {
        const promises = queryResult.rows.map((ele, idx) => {
            return scrap_function(ele, idx + 1);  
        });
        return Promise.all(promises);
    })
    .then(() => {
        const endTime = Date.now(); 
        const timeTaken = (endTime - startTime) / 1000; 
        turso.execute("SELECT COUNT(*) as count FROM Student_Data ;")
        .then((resppp)=>{
            res.status(200).send(`Scraping and update completed in ${timeTaken} seconds. Records Updates : ${resppp.rows[0]['count']}`);
        })
    })
    .catch((err) => {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Failed to execute query");
    });
    
});

app.post("/get-user-data",(req,res)=>{
    const {roll} = req.body;
    console.log(roll)
    turso.execute(
        {
            sql:` 
    SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    sd.department,
    lc.Username AS lc_username,
    COALESCE(lc.EasyProblemSolved, 0) AS lc_easy,
    COALESCE(lc.MediumProblemSolved, 0) AS lc_medium,
    COALESCE(lc.HardProblemSolved, 0) AS lc_hard,
    cc.Contests AS cc_contests,
    COALESCE(cc.ProblemSolved, 0) AS cc_problemsolved,
    cc.Username AS cc_username,
    hr.Username AS hrc_username,
    COALESCE(hr.oneStarBadge, 0) AS hrc_oneStarBadge,
    COALESCE(hr.twoStarBadge, 0) AS hrc_twoStarBadge,
    COALESCE(hr.threeStarBadge, 0) AS hrc_threeStarBadge,
    COALESCE(hr.fourStarBadge, 0) AS hrc_fourStarBadge,
    COALESCE(hr.fiveStarBadge, 0) AS hrc_fiveStarBadge,
    COALESCE(hr.AdvancedCertifications, 0) AS hrc_AdvancedCertifications,
    COALESCE(hr.IntermediateCertifications, 0) AS hrc_IntermediateCertifications,
    COALESCE(hr.BasicCertifications, 0) AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    COALESCE(gfg.Rank_, 0) AS gfg_rank,
    COALESCE(gfg.ProblemSolved, 0) AS gfg_problemSolved,
    COALESCE(gfg.ContestRating, 0) AS gfg_contestRating,
    COALESCE(gfg.Score, 0) AS gfg_score,
    ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) ) AS LC_S,
    ((COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0))) AS CC_S,
    ( (COALESCE(gfg.Score, 0)) ) AS GFG_S,
    
    (
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
    ) AS HRC_S,
    (
       ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) )+

        ((COALESCE(cc.Contests, 0) * 5) +
        (COALESCE(cc.ProblemSolved, 0)) )+
       ( (COALESCE(gfg.Score, 0))) +
       ( (COALESCE(hr.oneStarBadge, 0) * 1) +
        (COALESCE(hr.twoStarBadge, 0) * 2) +
        (COALESCE(hr.threeStarBadge, 0) * 3) +
        (COALESCE(hr.fourStarBadge, 0) * 4) +
        (COALESCE(hr.fiveStarBadge, 0) * 5) +
        (COALESCE(hr.AdvancedCertifications, 0) * 7) +
        (COALESCE(hr.IntermediateCertifications, 0) * 5) +
        (COALESCE(hr.BasicCertifications, 0) * 3))
    ) AS OverallScore,
    RANK() OVER (ORDER BY 
        (
            (COALESCE(lc.EasyProblemSolved, 0) * 1) +
            (COALESCE(lc.MediumProblemSolved, 0) * 3) +
            (COALESCE(lc.HardProblemSolved, 0) * 5) +
            (COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0)) +
            (COALESCE(gfg.Score, 0)) +
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
        ) DESC
    ) AS rank
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        WHERE sd.RollNumber LIKE (:roll);
            `,
            args : {roll:roll}
        }
    )
    .then((resp)=>{
        if(resp.rows.length===1){
            res.status(200).json(resp.rows);
        }else{
            if(resp.rows.length>1){
                res.status(400).json({'message':'Multiple Users!'})
            }
            else{
                res.status(400).json({'message':' Users not found'})
            }
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({'message':' Please Try later!'})
    })
})

app.get('/get-all-data',(req,res)=>{
    turso.execute(
        `
           SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    sd.department,
    lc.Username AS lc_username,
    COALESCE(lc.EasyProblemSolved, 0) AS lc_easy,
    COALESCE(lc.MediumProblemSolved, 0) AS lc_medium,
    COALESCE(lc.HardProblemSolved, 0) AS lc_hard,
    cc.Contests AS cc_contests,
    COALESCE(cc.ProblemSolved, 0) AS cc_problemsolved,
    cc.Username AS cc_username,
    hr.Username AS hrc_username,
    COALESCE(hr.oneStarBadge, 0) AS hrc_oneStarBadge,
    COALESCE(hr.twoStarBadge, 0) AS hrc_twoStarBadge,
    COALESCE(hr.threeStarBadge, 0) AS hrc_threeStarBadge,
    COALESCE(hr.fourStarBadge, 0) AS hrc_fourStarBadge,
    COALESCE(hr.fiveStarBadge, 0) AS hrc_fiveStarBadge,
    COALESCE(hr.AdvancedCertifications, 0) AS hrc_AdvancedCertifications,
    COALESCE(hr.IntermediateCertifications, 0) AS hrc_IntermediateCertifications,
    COALESCE(hr.BasicCertifications, 0) AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    COALESCE(gfg.Rank_, 0) AS gfg_rank,
    COALESCE(gfg.ProblemSolved, 0) AS gfg_problemSolved,
    COALESCE(gfg.ContestRating, 0) AS gfg_contestRating,
    COALESCE(gfg.Score, 0) AS gfg_score,
    ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) ) AS LC_S,
    ((COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0))) AS CC_S,
    ( (COALESCE(gfg.Score, 0)) ) AS GFG_S,
    
    (
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
    ) AS HRC_S,
    (
       ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) )+

        ((COALESCE(cc.Contests, 0) * 5) +
        (COALESCE(cc.ProblemSolved, 0)) )+
       ( (COALESCE(gfg.Score, 0))) +
       ( (COALESCE(hr.oneStarBadge, 0) * 1) +
        (COALESCE(hr.twoStarBadge, 0) * 2) +
        (COALESCE(hr.threeStarBadge, 0) * 3) +
        (COALESCE(hr.fourStarBadge, 0) * 4) +
        (COALESCE(hr.fiveStarBadge, 0) * 5) +
        (COALESCE(hr.AdvancedCertifications, 0) * 7) +
        (COALESCE(hr.IntermediateCertifications, 0) * 5) +
        (COALESCE(hr.BasicCertifications, 0) * 3))
    ) AS OverallScore,
    RANK() OVER (ORDER BY 
        (
            (COALESCE(lc.EasyProblemSolved, 0) * 1) +
            (COALESCE(lc.MediumProblemSolved, 0) * 3) +
            (COALESCE(lc.HardProblemSolved, 0) * 5) +
            (COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0)) +
            (COALESCE(gfg.Score, 0)) +
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
        ) DESC
    ) AS rank
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        ORDER BY 
            OverallScore DESC;
        `
    )
    .then((eess)=>{
        res.status(200).json(eess.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
})

// app.get("/put_departments", (req, res) => {
//     const data = [
//         {
//             departmentCode: "CSE",
//             departmentName: "Computer Science and Engineering"
//         },
//         {
//             departmentCode: "IT",
//             departmentName: "Information Technology"
//         },
//         {
//             departmentCode: "CSIT",
//             departmentName: "Computer Science and Engineering & Information Technology"
//         },
//         {
//             departmentCode: "CSD",
//             departmentName: "Computer Science and Engineering Data Science"
//         },
//         {
//             departmentCode: "CSM",
//             departmentName: "Computer Science and Engineering (AI & ML)"
//         },
//         {
//             departmentCode: "CSC",
//             departmentName: "Computer Science and Engineering Cyber Security"
//         },
//         {
//             departmentCode: "ECE",
//             departmentName: "Electronics and Communication Engineering"
//         },
//         {
//             departmentCode: "EEE",
//             departmentName: "Electrical and Electronics Engineering"
//         },
//         {
//             departmentCode: "AE",
//             departmentName: "Aeronautical Engineering"
//         },
//         {
//             departmentCode: "ME",
//             departmentName: "Mechanical Engineering"
//         },
//         {
//             departmentCode: "CE",
//             departmentName: "Civil Engineering"
//         }
//     ];

//     const queries = data.map(department => {
//         return turso.execute(`INSERT INTO Departments (departmentCode, departmentName) VALUES (?, ?)`, 
//                              [department.departmentCode, department.departmentName]);
//     });

//     Promise.all(queries)
//         .then(results => {
//             res.status(200).json({ message: "Departments inserted successfully", results });
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(400).json({ error });
//         });
// });

app.get("/get-departments",(req,res)=>{
    turso.execute("SELECT * FROM Departments ;")
    .then((resp)=>{
        res.status(200).json(resp.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json(err);
    })
})

app.post('/addStudent',(req,res)=>{
    const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG } = req.body;
    console.log(RollNumber);
    turso.execute({
        sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
	            VALUES (:rollNo,:name,:dept) ;`,
                args:{rollNo:RollNumber,name:Name,dept:Department}
    })
        .then((respp)=>{
            console.log("student Added");
            turso.execute({
                sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
                args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode}
            })
            .then((res0)=>{
                console.log("Leetcode Username added");
                turso.execute({
                    sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
                    args:{roll:RollNumber,GfG:GfG.length===0?null:GfG}
                })
                .then((res1)=>{
                    console.log("CodeChef Username added");
                    turso.execute({
                        sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
                        args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef}
                    })
                    .then((res2)=>{
                        console.log("HackerRank Username added");
                        turso.execute({
                            sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
                            args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank}
                        })
                        .then((res3)=>{
                            console.log("Leetcode Username added");
                            res.status(200).json(JSON.stringify(res3.rows));
                        })
                        .catch((er3)=>{
                            console.log(er3);
                            res.status(400).json(er3);
                        })                    })
                    .catch((er2)=>{
                        console.log(er2);
                        res.status(400).json(er2);
                    })                
                })
                .catch((er1)=>{
                    console.log(er1);
                    res.status(400).json(er0);
                })
            })
            .catch((er0)=>{
                console.log(er0);
                res.status(400).json(er0);
            })
        })
        .catch((er)=>{
            console.log(er);
            res.status(400).json(er);
        })
})

app.post('/update_user',(req,res)=>{
    const  RollNumber = req.body.RollNumber;
    console.log(RollNumber)
    turso.execute({
        sql:`
        SELECT 
            sd.RollNumber,
            sd.Name,
            lc.Username AS leetcode,
            cc.Username AS codechef,
            hr.Username AS hackerrank,
            gfg.Username AS gfg
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber 
        WHERE sd.RollNumber = (:RollNumber) 
        GROUP BY 
            sd.RollNumber, sd.Name, lc.Username, cc.Username, hr.Username, gfg.Username ;
    `,
    args:{ RollNumber:RollNumber}
})
    .then((respp)=>{
        console.log(respp.rows);
        if(respp.rows.length > 0){

            let failed = '';
            let success = '';
            const lc = respp.rows[0].leetcode;
            const cc = respp.rows[0].codechef;
            const hr = respp.rows[0].hackerrank;
            const gfg = respp.rows[0].gfg;
            
            if (lc) {
                const data_leet = get_LeetCode(lc);
                Promise.resolve(data_leet)
                    .then((res) => {
                        const name = res.name || '';
                        const easy = res.problemsSolved.Easy || 0;
                        const medium = res.problemsSolved.Medium || 0;
                        const hard = res.problemsSolved.Hard || 0;
                        const user = lc || '';
                        turso.execute({
                            sql: `UPDATE LeetCode SET Name = :name, EasyProblemSolved = :easy, 
                                    MediumProblemSolved = :medium, HardProblemSolved = :hard WHERE username = :user;`,
                            args: { name, easy, medium, hard, user }
                        })
                        .then((result) => {
                            success = success.concat('LeetCode,')
                            console.log(" - LeetCode ",lc," Updated Successfully. Progress : 1/4 ");
                        })
                        .catch((err) => {
                            failed = failed.concat('LeetCode Failed ,');
                            console.error("LeetCode Update Failed:", err);
                        });
                    })
                    .catch((err) => {
                        console.error("Error fetching LeetCode data:", err);
                    });
            }
            else{
                failed = failed.concat('LeetCode No Account ,');
                console.log(RollNumber+"No LeetCode account ?")
            }
        
            if (gfg) {
                const data_gfg = get_GeekForGeeks(gfg);
                Promise.resolve(data_gfg)
                    .then((res12) => {
                        const collegeName = res12.college || '';
                        const rank = res12.Rank || null;
                        const problemSolved = res12.problems_solved || 0;
                        const contestRating = res12.contest_rating || 0;
                        const score = res12.score || 0;
                        const user = gfg || '';
                        turso.execute({
                            sql: `UPDATE GeekForGeeks SET CollegeName = :collegeName, Rank_ = :rank, 
                                ProblemSolved = :problemSolved, ContestRating = :contestRating, 
                                Score = :score WHERE Username = :user;`,
                            args: { collegeName, rank, problemSolved, contestRating, score, user }
                        })
                        .then((res_12) => {
                            console.log(" - GeekForGeeks ",gfg," Updated Successfully. Progress: 3/4");
                            success = success.concat('GeekForGeeks,')
                            
                        })
                        .catch((err12) => {
                            failed = failed.concat('GeekForGeeks failed,');
                            console.log(err12);
                        });
                    })
                    .catch((err1) => {
                        console.log(err1);
                    });
            } else{
                failed = failed.concat('GeekForGeeks No Account,');
                console.log(RollNumber+"No GFG account ?")
            }
        
            if (hr) {
                const data_hacker_rank = get_HackerRank(hr);
                Promise.resolve(data_hacker_rank)
                    .then((res123) => {
                        console.log(res123);
                        const name = res123.name || '';
                        const oneStarBadge = res123.badges.oneStarBadge || 0;
                        const twoStarBadge = res123.badges.twoStarBadge || 0;
                        const threeStarBadge = res123.badges.threeStarBadge || 0;
                        const fourStarBadge = res123.badges.fourStarBadge || 0;
                        const fiveStarBadge = res123.badges.fiveStarBadge || 0;
                        const advancedCert = res123.certificates.advanced || 0;
                        const intermediateCert = res123.certificates.intermediate || 0;
                        const basicCert = res123.certificates.basic || 0;
                        const user = hr || '';
                        turso.execute({
                            sql: `UPDATE HackerRank SET Name = :name, oneStarBadge = :oneStarBadge, 
                                twoStarBadge = :twoStarBadge, threeStarBadge = :threeStarBadge, 
                                fourStarBadge = :fourStarBadge, fiveStarBadge = :fiveStarBadge, 
                                AdvancedCertifications = :advancedCert, IntermediateCertifications = :intermediateCert, 
                                BasicCertifications = :basicCert WHERE Username = :user;`,
                            args: { name, oneStarBadge, twoStarBadge, threeStarBadge, 
                                    fourStarBadge, fiveStarBadge, advancedCert, 
                                    intermediateCert, basicCert, user }
                        })
                        .then((res1234) => {
                            success = success.concat('HackerRank ,');
                            console.log(" - HackerRank ",hr," Updated Successfully. Progress: 4/4");
                        })
                        .catch((Err1234) => {
                            failed = failed.concat('HackerRank ,');
                            console.log(Err1234);
                        });
                    })
                    .catch((err123) => {
                        console.log(err123);
                    });
            }
            else{
                failed = failed.concat('HackerRank No Account,');
                console.log(RollNumber+"No HackerRank account ?")
            }
        
            if (cc) {
                const data_codechef = get_CodeChef(cc);
                Promise.resolve(data_codechef)
                    .then((res1) => {
                        const name = res1.name || '';
                        const contests = res1.contests || 0;
                        const problemSolved = res1['problems-Solved'] || 0;
                        const user = cc || '';
                        turso.execute({
                            sql: `UPDATE CodeChef SET Name = :name, Contests = :contests, 
                                ProblemSolved = :problemSolved WHERE Username = :user;`,
                            args: { name, contests, problemSolved, user }
                        })
                        .then((res_1) => {
                            success = success.concat('CodeChef ,');
                            console.log(" - CodeChef ",cc," Updated Successfully. Progress: 2/4");                            
                        })
                        .catch((err1) => {
                            failed = failed.concat('CodeChef Failed,');
                            console.log(err1);
                        });
                    })
                    .catch((err1) => {
                        console.log(err1);
                    });
            }
            else{
                failed = failed.concat('CodeChef No Account,');
                console.log(RollNumber+"No CodeChef account ?")
            }
            update_login(RollNumber);
            res.status(200).json({'failed':failed,'success':success,'message':'Completed'});
        }
        else{
            res.status(400).json(respp.rows);
        }
    })
    .catch((erro)=>{
        console.log(erro.message);
        res.status(400).json({'message':'SomeThing went wrong'});
    })
})

const update_login = (RollNumber) => {
    const currentDateTime = new Date().toISOString(); 
    console.log('update-time:', RollNumber, currentDateTime);
    
    return turso.execute({
        sql: `UPDATE LogIN_Stasts
              SET lastLogin = :lastLogin
              WHERE RollNumber = :RollNumber;`,
        args: {
            RollNumber,          
            lastLogin: currentDateTime
        }
    });
};


app.post('/login',(req,res)=>{
    const {RollNumber,Password} = req.body;
    console.log(RollNumber,Password)
    turso.execute({
        sql:"SELECT * FROM Users WHERE RollNumber = (:RollNumber)",
        args:{ RollNumber: RollNumber }
    })
    .then((res0)=>{
        console.log(res0.rows)
        if(res0.rows.length === 1){
            if((res0.rows[0].Password === Password)){
                const currentDate = new Date();
                const expireTime = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
                console.log(expireTime);
                console.log(RollNumber,"Logged IN");
                res.status(200).json({'message':"Correct",'expire_time':expireTime});
    
            }else{
                console.log(RollNumber,"LogIN - failed");
                res.status(200).json({'message':"Wrong Password"});
            }
        }
        else{
            console.log("User not found")
            res.status(400).json({'message':"User not found"});
        }
    })
    .catch((err)=>{
        console.log(err,"LogIN - failed");
        console.log(RollNumber,"LogIN - failed");
        res.status(400).json({'message':'Please try Again Later'});
    })
})

const delete_user = (RollNumber) => {
    console.log(RollNumber)
   return turso.execute({
        sql: `DELETE FROM Student_Data WHERE RollNumber = :rollNo;`,
        args: { rollNo: RollNumber }
    })
    // .then((res)=>{
    //     console.log('Deleted - ',RollNumber);
    // })
    // .catch((err)=>{
    //     console.log(err.message);
    // })
}

app.post('/del_acc_imp',(req,res)=>{
    const {RollNumber} = req.body;
    console.log('Deleting.',RollNumber)
    if(RollNumber.length > 0){
        delete_user(RollNumber)
        .then((resss)=>{
            res.status(200);
        })
        .catch((err)=>{
            console.log(err.message);
            res.status(500);
        })
    }
    res.status(500);
})

app.post('/register',(req,res)=>{
    const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG,Password } = req.body;
    console.log(RollNumber,leetcode,CodeChef,HackerRank,GfG)
    turso.execute({
        sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
	            VALUES (:rollNo,:name,:dept) ;`,
                args:{rollNo:RollNumber,name:Name,dept:Department}
    })
        .then((respp)=>{
            console.log("student Added");
            turso.execute({
                sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
                args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode}
            })
            .then((res0)=>{
                console.log("Leetcode Username added");
                turso.execute({
                    sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
                    args:{roll:RollNumber,GfG:GfG.length===0?null:GfG}
                })
                .then((res1)=>{
                    console.log("CodeChef Username added");
                    turso.execute({
                        sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
                        args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef}
                    })
                    .then((res2)=>{
                        console.log("HackerRank Username added");
                        turso.execute({
                            sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
                            args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank}
                        })
                        .then((res3)=>{
                            console.log("HackerRank Username added");
                            turso.execute(
                               {
                                sql :  `
                                INSERT INTO Users (RollNumber, Password)
                                VALUES  (:RollNumber, :Password);
                              `,args:{RollNumber,Password}
                               }
                            )
                            .then((res001)=>{
                                turso.execute({
                                    sql :`
                                    INSERT INTO Personal_Info (RollNumber)
                                    VALUES(:RollNumber);`,
                                    args:{RollNumber:RollNumber}
                                })
                                .then((res0909)=>{
                                    turso.execute({
                                        sql:`INSERT INTO LogIN_Stasts(RollNumber)
                                                    VALUES(:RollNumber);`,
                                        args:{RollNumber}
                                    })
                                    .then((res0038)=>{
                                        console.log(RollNumber,'- Registration Completed');
                                        res.status(200).json({'message':'OK'});
                                    })
                                    .catch((er00303)=>{
                                        console.log(er00303.message);
                                        delete_user(RollNumber)
                                        .catch((er345)=>{
                                            console.log(er345.message);
                                        })
                                        res.status(400).json({'message':'Failed to create an Account, ,Please retry. 0'});
                                    })
                                })
                                .catch((err0033)=>{
                                    console.log(err0033.message);
                                    delete_user(RollNumber)
                                    .catch((er345)=>{
                                        console.log(er345.message);
                                    })
                                    res.status(400).json({'message':'Failed to create an Account, ,Please retry.'});
                                })
                            })
                            .catch((err003)=>{
                                console.log("User adding failed",err003);
                                console.log(err003);
                                delete_user(RollNumber)
                                .catch((er345)=>{
                                    console.log(er345.message);
                                })
                                res.status(400).json({'message':'Failed to add HackerRank, ,Please retry. '});
                            })
                        })
                        .catch((er3)=>{
                            console.log(er3);
                            delete_user(RollNumber)
                            .catch((er345)=>{
                                console.log(er345.message);
                            })
                            res.status(400).json({'message':'Failed to add HackerRank ,Please retry. '});
                        })                    })
                    .catch((er2)=>{
                        console.log(er2);
                        delete_user(RollNumber)
                        .catch((er345)=>{
                            console.log(er345.message);
                        })
                        res.status(400).json({'message':'Failed to add CodeChef ,Please retry.'});
                    })                
                })
                .catch((er1)=>{
                    console.log(er1);
                    delete_user(RollNumber)
                    .catch((er345)=>{
                        console.log(er345.message);
                    })
                    res.status(400).json({'message':'Failed to add GeekforGeeks ,Please retry.'});
                })
            })
            .catch((er0)=>{
                console.log(er0);
                delete_user(RollNumber)
                .catch((er345)=>{
                    console.log(er345.message);
                })
                res.status(400).json({'message':'Failed to add LeetCode ,Please retry.'});
            })
        })
        .catch((er)=>{
            console.log(er);
            res.status(400).json(er.message);
        })
})

app.post('/update_password',(req,res)=>{
    const {RollNumber,old_,new_} = req.body;
    console.log(RollNumber);
    turso.execute({
        sql:`SELECT * FROM Users WHERE RollNumber = (:RollNumber) ;`,
        args:{RollNumber:RollNumber}
    })
    .then((res0)=>{
        if(res0.rows.length === 1){
            if(res0.rows[0].Password === old_){
                console.log('User'+RollNumber+' -> OK');
                turso.execute({
                    sql:`
                        UPDATE Users
                        SET Password = (:new_) 
                        WHERE RollNumber = (:RollNumber);`,
                    args : { new_ : new_ , RollNumber:RollNumber}
                })
                .then((Res1)=>{
                    console.log(Res1.rows[0])
                    res.status(200).json({'message':'Updated Successfully'});
                })
                .catch((err0)=>{
                    console.log(err0)
                    res.status(500).json({'message':'Something went wrong'});
                })
            }
            else{
                res.status(400).json({'message':'Wrong Password'});
            }
        }
        else{
            res.status(404).json({'message':'User not found'});
        }
    })
    .catch((err0)=>{
        console.log(err0)
        res.status(500).json({'message':'Something went wrong'});
    })
})
app.post('/get_skills', (req, res) => {
    const { rollNumber } = req.body;
    console.log(rollNumber)

    turso.execute({
        sql: `SELECT Skill,Skill_Level,Skill_Type FROM Skills WHERE RollNumber = (:rollNumber);`,
        args: { rollNumber }
    })
    .then((result) => {
        // console.log(result.rows)
        res.status(200).json({ skills:result.rows });
    })
    .catch((error) => {
        console.error("Error retrieving skills:", error.message);
        res.status(500).json({ message: 'Internal server error.' });
    });
});

app.post('/add_skill', (req, res) => {
    const { RollNumber, Skill, Skill_Level, Skill_Type } = req.body;
    console.log(RollNumber, Skill, Skill_Level, Skill_Type);    
    if (!RollNumber || !Skill) {
        return res.status(400).json({ message: 'RollNumber and Skill are required.' });
    }

    turso.execute({
        sql: `INSERT INTO Skills (RollNumber, Skill, Skill_Level, Skill_Type)
              VALUES (:RollNumber, :Skill, :Skill_Level, :Skill_Type);`,
        args: { RollNumber, Skill, Skill_Level, Skill_Type }
    })
    .then(() => {
        res.status(201).json({ message: 'Skill added successfully.' });
    })
    .catch((error) => {
        console.error("Error adding skill:", error.message);
        res.status(500).json({ message: 'Internal server error.' });
    });
});


app.post('/remove_skill', (req, res) => {
    const { RollNumber, Skill } = req.body;
    console.log(RollNumber,Skill )
    turso.execute({
        sql: `
            DELETE FROM Skills
            WHERE RollNumber = :rollNumber AND Skill = :skill;
        `,
        args: { rollNumber: RollNumber, skill: Skill }
    })
    .then((response) => {
        if (response.rowsAffected > 0) {
            console.log(`Skill "${Skill}" removed successfully for RollNumber ${RollNumber}`);
            res.status(200).json({ message: 'Skill removed successfully' });
        } else {
            console.log(`Skill "${Skill}" not found for RollNumber ${RollNumber}`);
            res.status(404).json({ message: 'Skill not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Failed to remove skill, please try again.' });
    });
});


app.post('/get_data_for_settings',(req,res)=>{  
    const {RollNumber} = req.body;
    console.log(RollNumber);
    turso.execute(`
        SELECT 
            P.About,
            P.FaceBook,
            P.GitHub,
            P.Instagram,
            P.LinkedIN,
            P.MailAddress,
            P.Resume,
            P.YouTube,
            P.X,
            L.Username AS LeetCodeUsername,
            C.Username AS CodeChefUsername,
            H.Username AS HackerRankUsername,
            G.Username AS GeekForGeeksUsername,
            U.Name AS Name,
            U.Department AS Department
        FROM 
            Personal_Info AS P
        LEFT JOIN 
            LeetCode AS L ON P.RollNumber = L.RollNumber
        LEFT JOIN 
            CodeChef AS C ON P.RollNumber = C.RollNumber
        LEFT JOIN 
            HackerRank AS H ON P.RollNumber = H.RollNumber
        LEFT JOIN 
            GeekForGeeks AS G ON P.RollNumber = G.RollNumber
        LEFT JOIN 
            Student_Data AS U ON P.RollNumber = U.RollNumber
        WHERE 
            P.RollNumber = :rollNumber;
    `, { rollNumber: RollNumber })
    .then((resp0)=>{
        if(resp0.rows.length===1){
            res.status(200).json(resp0.rows);
        }
        else{
            res.status(400).json({'message':'Multiple or No users found !'});
        }
    })
    .catch((Err)=>{
        console.log(Err);
        res.status(500).json({'message':'Failed'});
    })
    
})

app.post('/update_personal_data', (req, res) => {
    const { 
        RollNumber, 
        About, 
        CodeChefUsername, 
        Department, 
        Facebook, 
        GeekForGeeksUsername, 
        Github, 
        HackerRankUsername, 
        Instagram, 
        LeetCodeUsername, 
        LinkedIn, 
        MailAddress, 
        Name, 
        Youtube,
        Resume, 
        X 
    } = req.body;

    console.log(RollNumber,MailAddress,About)

    turso.execute({
        sql: `
        UPDATE Personal_Info
        SET 
            About = (:About),
            Facebook = (:Facebook),
            Github = (:Github),
            Instagram = (:Instagram),
            LinkedIn = (:LinkedIn),
            YouTube = (:Youtube),
            MailAddress = (:MailAddress),
            Resume = (:Resume),
            X = (:X)
        WHERE RollNumber = (:RollNumber);
        `,
        args: {About:About,
            Facebook:Facebook,
            Instagram:Instagram,
            Github:Github,
            LinkedIn:LinkedIn,
            MailAddress:MailAddress,
            Resume:Resume,
            X:X,
            Youtube:Youtube,
            RollNumber:RollNumber
        }
    })
    .then(result => {
        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(result)
        res.status(200).json({ message: 'Personal info updated successfully' });
    })
    .catch(error => {
        console.error("Database error:", error);  // Log detailed error
        res.status(500).json({ message: 'Internal server error' });
    });
});

app.post('/update_usernames', (req, res) => {
    const { RollNumber, lc_username, cc_username, gfg_username, hrc_username } = req.body;
    console.log(RollNumber)
    if (!RollNumber) {
        return res.status(400).json({ 'message': 'RollNumber is required' });
    }
    console.log('Received usernames:', lc_username, cc_username, gfg_username, hrc_username);
    turso.execute({
            sql: `UPDATE LeetCode SET Username = (:lc_username) WHERE RollNumber = (:RollNumber);`,
            args: { lc_username, RollNumber }
        })
    .then(() => {
        
        turso.execute( {
            sql: `UPDATE CodeChef SET Username = (:cc_username) WHERE RollNumber = (:RollNumber);`,
            args: { cc_username, RollNumber }
        })
        .then(()=>{
            turso.execute(
                {
                    sql: `UPDATE GeekForGeeks SET Username = (:gfg_username) WHERE RollNumber = (:RollNumber);`,
                    args: { gfg_username, RollNumber }
                })
            .then(()=>{
                turso.execute(
                    {
                        sql: `UPDATE HackerRank SET Username = (:hrc_username) WHERE RollNumber = (:RollNumber);`,
                        args: { hrc_username, RollNumber }
                    })
                    .then((rr)=>{
                        console.log(`Usernames updated for RollNumber ${RollNumber}`,rr);
                        res.status(200).json({ 'message': 'Usernames updated successfully across all platforms' });
                    })
                    .catch((er089)=>{
                        console.log(er089);
                        res.status(500).json({ 'message': 'Failed to update usernames' });
                    })
            })
            .catch((err12)=>{
                console.log((err12));
                res.status(500).json({ 'message': 'Failed to update usernames' });
            })
            
        })
        .catch((err01)=>{
                console.log(err01);
                res.status(500).json({ 'message': 'Failed to update usernames' });

        })
    })
    .catch((error) => {
        console.error('Error updating usernames:', error);
        res.status(500).json({ 'message': 'Failed to update usernames' });
    });
});

app.post('/add_project',(req,res)=>{
    const {RollNumber,title,description,url,Caption} = req.body;
    console.log(RollNumber)
    const P_id = uuidv4();
    // console.log(RollNumber,title,description,url,Caption);

    turso.execute({
        sql : `
            INSERT INTO Projects(RollNumber,Title,URL,Description,Caption,P_id)
            VALUES(:RollNumber,:title,:url,:description,:Caption,:P_id); 
        `,
        args:{RollNumber,title,url,description,Caption,P_id}
    })
    .then((reso)=>{
        console.log(reso.rows);
        res.status(200).json(reso.rows);
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(500).json({'message':'Please try again.'});
    })

})

app.post('/get_projects',(req,res)=>{
    const {RollNumber} = req.body;
    console.log(RollNumber);
    turso.execute({
        sql: `SELECT Title,Description,Caption,URL,P_id FROM Projects WHERE RollNumber = :RollNumber AND isDeleted = 0 ;`,
        args : { RollNumber }
    })
    .then((resp0)=>{
        // console.log(resp0.rows)
        res.status(200).json(resp0.rows);
    })
    .catch((Err)=>{
        console.log(Err.message);
        res.status(500).json({'message':'Server Error!'})
    })
})

app.post('/delete_prj',(req,res)=>{
    const {RollNumber,P_id} = req.body;
    console.log(RollNumber)
    turso.execute({
        sql : `UPDATE Projects
                SET isDeleted = 1
                WHERE RollNumber = :RollNumber AND P_id = :P_id;`,
        args : {RollNumber,P_id}
    })
    .then((RE0s)=>{
        res.status(200).json(RE0s.rows);
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(500).json(err.message);
    })
})

app.post('/add_internship',(req,res)=>{
    const {RollNumber,title,description,url,Caption} = req.body;
    const C_id = uuidv4();
    console.log(RollNumber)

    turso.execute({
        sql : `
            INSERT INTO Certifications(RollNumber,Title,URL,Description,Caption,C_id)
            VALUES(:RollNumber,:title,:url,:description,:Caption,:C_id); 
        `,
        args:{RollNumber,title,url,description,Caption,C_id}
    })
    .then((reso)=>{
        console.log(reso.rows);
        res.status(200).json(reso.rows);
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(500).json({'message':'Please try again.'});
    })

})

app.post('/get_internships',(req,res)=>{
    const {RollNumber} = req.body;
    console.log(RollNumber);
    turso.execute({
        sql: `SELECT Title,Description,Caption,URL,C_id FROM Certifications WHERE RollNumber = :RollNumber AND isDeleted = 0 ;`,
        args : { RollNumber }
    })
    .then((resp0)=>{
        // console.log(resp0.columns)
        res.status(200).json(resp0.rows);
    })
    .catch((Err)=>{
        console.log(Err.message);
        res.status(500).json({'message':'Server Error!'})
    })
})

app.post('/delete_internship',(req,res)=>{
    const {RollNumber,C_id} = req.body;
    console.log(RollNumber)
    turso.execute({
        sql : `UPDATE Certifications
                SET isDeleted = 1
                WHERE RollNumber = :RollNumber AND C_id = :C_id;`,
        args : {RollNumber,C_id}
    })
    .then((RE0s)=>{
        res.status(200).json(RE0s.rows);
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(500).json(err.message);
    })
})

app.post('/name',(req,res)=>{
    const {roll} = req.body;
    console.log(roll)
    turso.execute({
        sql:'SELECT Name FROM Student_Data WHERE RollNumber = :roll ;',
        args :{roll}
    })
    .then((ro)=>{
        if(ro.rows.length===0){
            res.status(404).json([]);
        }else{
            res.status(200).json(ro.rows);
        }
    })
    .catch((e4)=>{
        res.status(500).json({'message':e4.message});
    })
})


app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
