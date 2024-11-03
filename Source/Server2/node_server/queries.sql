CREATE TABLE if NOT EXISTS
	Departments(
		departmentCode VARCHAR(10) PRIMARY KEY,
        departmentName VARCHAR(255) UNIQUE
    );

CREATE TABLE IF NOT EXISTS
	Student_Data(
		RollNumber VARCHAR(10) PRIMARY KEY,
        Name VARCHAR(255),
        Department VARCHAR(10),
		FOREIGN KEY (Department) REFERENCES Departments(departmentCode) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS Skills (
    RollNumber VARCHAR(10),
    Skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (RollNumber, Skill), 
    FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE  );


CREATE TABLE IF NOT EXISTS Personal_Info (
    RollNumber VARCHAR(10) PRIMARY KEY,
    MailAddress VARCHAR(255) UNIQUE,
    Resume VARCHAR(255) DEFAULT NULL,
    About TEXT,
    LinkedIN VARCHAR(255),
    YouTube VARCHAR(255),
    FaceBook VARCHAR(255),
    Instagram VARCHAR(255),
    X VARCHAR(255),
    GitHub VARCHAR(255),
    FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
);


-- INSERT INTO Personal_Info (RollNumber)
-- SELECT RollNumber
-- FROM Student_Data
-- WHERE RollNumber NOT IN (SELECT RollNumber FROM Personal_Info);



CREATE TABLE IF NOT EXISTS
	LeetCode(
		RollNumber VARCHAR(10) PRIMARY KEY,
        Username VARCHAR(255) UNIQUE,
        Name VARCHAR(255),
        EasyProblemSolved INT DEFAULT 0,
        MediumProblemSolved INT DEFAULT 0,
        HardProblemSolved INT DEFAULT 0,
		FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
  Users (
    RollNumber VARCHAR(10) PRIMARY KEY,
    Password VARCHAR(255),
    FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
  );

  
CREATE TABLE IF NOT EXISTS
	CodeChef(
		RollNumber VARCHAR(10) PRIMARY KEY,
		Username VARCHAR(255) UNIQUE,
        Name VARCHAR(255),
        Contests INT,
        ProblemSolved INT,
        FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    );
    
CREATE TABLE IF NOT EXISTS
	HackerRank(
		RollNumber VARCHAR(10) PRIMARY KEY,
		Username VARCHAR(255) UNIQUE,
        Name VARCHAR(255),
        oneStarBadge INT DEFAULT 0,
        twoStarBadge INT DEFAULT 0,
        threeStarBadge INT DEFAULT 0,
        fourStarBadge INT DEFAULT 0,
        fiveStarBadge INT DEFAULT 0,
        AdvancedCertifications INT DEFAULT 0,
        IntermediateCertifications INT DEFAULT 0,
        BasicCertifications INT DEFAULT 0,
        FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
	GeekForGeeks(
		RollNumber VARCHAR(10) PRIMARY KEY,
		Username VARCHAR(255) UNIQUE,
        CollegeName VARCHAR(255),
        Rank_ INT DEFAULT NULL,
        ProblemSolved INT DEFAULT 0,
        ContestRating INT DEFAULT 0,
        Score INT DEFAULT 0,
        FOREIGN KEY (RollNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    );



---  Projects and internships

CREATE TABLE IF NOT  EXISTS
    Projects(
                RollNumber VARCHAR(10) ,
                Title VARCHAR(255) NOT NULL ,
                URL TEXT,
                Description TEXT,
                Caption   VARCHAR(255),
                P_id VARCHAR(255) UNIQUE,
                Primary kEY (RollNumber,P_id),
                FOREIGN KEY (ROllNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    ) ;

CREATE TABLE IF NOT  EXISTS
    Certifications(
                RollNumber VARCHAR(10) ,
                Title VARCHAR(255) NOT NULL ,
                URL TEXT,
                Description TEXT,
                Caption   VARCHAR(255),
                C_id VARCHAR(255) UNIQUE,
                  Primary kEY (RollNumber,C_id),
                FOREIGN KEY (ROllNumber) REFERENCES Student_Data(RollNumber) ON DELETE CASCADE
    ) ;

-- -----------------------------


INSERT  INTO Departments(departmentCode , departmentName)
  VALUES ("CSE","Computer Science and Engineering");

--  ----------------------------------------------            TESTING            ----------------------------------------------------------- --

INSERT INTO Student_Data(RollNumber,Name,Department)
	VALUES ("22951A05G8","Sai Varun Poludasu","CSE") ;

-- -------------------------------------------------------------------

SELECT *  FROM  Departments;

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

-- ------------------

SELECT EasyProblemSolved,MediumProblemSolved,HardProblemSolved FROM LeetCode;

SELECT Contests,ProblemSolved FROM CodeChef;

SELECT ProblemSolved,ContestRating,ContestRating FROM GeekForGeeks;

SELECT oneStarBadge, 
        twoStarBadge ,
        threeStarBadge ,
        fourStarBadge ,
        fiveStarBadge ,
        AdvancedCertifications ,
        IntermediateCertifications ,
  BasicCertifications FROM HackerRank;


SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    d.departmentName AS depatname,
    lc.Username AS lc_username,
    lc.EasyProblemSolved AS lc_easy,
    lc.MediumProblemSolved AS lc_medium,
    lc.HardProblemSolved AS lc_hard,
    cc.Contests AS cc_contests,
    cc.ProblemSolved AS cc_problemsolved,
    cc.Username AS cc_username,
  hr.username AS hrc_username,
    hr.oneStarBadge AS hrc_oneStarBadge,
    hr.twoStarBadge AS hrc_twoStarBadge,
    hr.threeStarBadge AS hrc_threeStarBadge,
    hr.fourStarBadge AS hrc_fourStarBadge,
    hr.fiveStarBadge AS hrc_fiveStarBadge,
    hr.AdvancedCertifications AS hrc_AdvancedCertifications,
    hr.IntermediateCertifications AS hrc_IntermediateCertifications,
    hr.BasicCertifications AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    gfg.Rank_ AS gfg_rank,
    gfg.ProblemSolved AS gfg_problemSolved,
    gfg.ContestRating AS gfg_contestRating,
    gfg.Score AS gfg_score
FROM 
    Student_Data sd
JOIN 
    Departments d ON sd.Department = d.departmentCode
LEFT JOIN 
    LeetCode lc ON sd.RollNumber = lc.RollNumber
LEFT JOIN 
    CodeChef cc ON sd.RollNumber = cc.RollNumber
LEFT JOIN 
    HackerRank hr ON sd.RollNumber = hr.RollNumber
LEFT JOIN 
    GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber;
