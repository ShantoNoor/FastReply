document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key == "1") {
    const assignmentInfo = document.querySelector(
      ".assignment-evaluation-form"
    ).innerText;

    const assignmentTitle =
      assignmentInfo.match(/Assignment \d\d?/gm)?.[0] || "";
    const studentName =
      new RegExp(/Student Name\n(.*?)\n/gm).exec(assignmentInfo)?.[1] || "";
    const studentId =
      new RegExp(/Roll\n(.*?)\n/gm).exec(assignmentInfo)?.[1] || "";
    const studentEmail =
      new RegExp(/Email\n(.*?)\n/gm).exec(assignmentInfo)?.[1] || "";
    const deadline60 =
      new RegExp(/Deadline \( 1st \)60\n(.*?)\n/gm).exec(assignmentInfo)?.[1] ||
      "";
    const deadline50 =
      new RegExp(/Deadline \( 2nd \)50\n(.*?)\n/gm).exec(assignmentInfo)?.[1] ||
      "";
    const lifeUsed =
      assignmentInfo.match(/Late Submission Using Gem for 60/gm)?.[0] || "";
    const assignmentData =
      new RegExp(/Assignment's Data \n((.|\n)*?)\n(Mark|Unassigned)/gm).exec(
        assignmentInfo
      )?.[1] || "";
    const recheckData =
      new RegExp(/Recheck Reason\n\n((.|\n)*?)\n\nGive/gm).exec(
        assignmentInfo
      )?.[1] || "";

    const category =
      new RegExp(/Variant\n(.*?)\n/gm).exec(assignmentInfo)?.[1] || "";

    let headersList = {
      "x-appwrite-project": "670f50e3001ea5b9bd95",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      data: {
        assignmentTitle,
        studentName,
        studentId,
        studentEmail,
        deadline60,
        deadline50,
        lifeUsed,
        assignmentData: recheckData + "  \n  " + assignmentData,
        feedback007: "<h1>Started Checking Assignment!...</h1>",
        mark007: -1,
        totalMark007: -1,
        checkComplete: false,
        category
      },
    });

    console.log({
      assignmentTitle,
      studentName,
      studentId,
      studentEmail,
      deadline60,
      deadline50,
      lifeUsed,
      assignmentData: recheckData + "  \n  " + assignmentData,
      category
    });

    fetch(
      import.meta.env.VITE_APPWRITE_UPLOAD_URL,
      {
        method: "PATCH",
        body: bodyContent,
        headers: headersList,
      }
    )
      .then((data) => {
        if (data.status === 200) {
          return data.json();
        } else {
          alert("Failed to update Feedback! Try again!...");
        }
      })
      .then((data) => {
        document.querySelector("label p").innerHTML =
          "Uploaded Info at → " +
          new Date(data.$updatedAt).toLocaleTimeString();
      })
      .catch((err) => {
        alert("An Error occurred while uploading");
        console.error(err);
      });
  }

  if (e.ctrlKey && e.key == "2") {
    fetch(
      import.meta.env.VITE_APPWRITE_UPLOAD_URL,
      {
        headers: {
          "content-type": "application/json",
          "x-appwrite-project": "670f50e3001ea5b9bd95",
        },
        method: "GET",
        mode: "cors",
        credentials: "include",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const textArea = document.querySelector(".ql-editor p");

        const assignmentTitle =
          document.querySelector("header strong")?.innerText || "";
        const studentEmail =
          document.querySelectorAll(".col-12.col-md-11")[3]?.innerText || "";

        if (
          data.assignmentTitle === assignmentTitle &&
          data.studentEmail === studentEmail
        ) {
          textArea.innerHTML = data.feedback007;

          const markBox = document.getElementById("Mark");
          // markBox.value = data.mark007;

          // if (data.totalMark007 !== 60) {
          //   const markEditButton = document.querySelector(
          //     ".btn.ml-2.btn-success.btn-sm"
          //   );
          //   if (!markEditButton.disabled) {
          //     markEditButton.click();
          //     markEditButton.disabled = true;
          //   }

          //   const totalMarkBox = document.getElementById("TotalMark");
          //   totalMarkBox.value = data.totalMark007;
          //   totalMarkBox.value = data.totalMark007;
          // }

          const currentTime = new Date();
          const lastUpdateTime = new Date(data.$updatedAt);
          const diffTime = currentTime - lastUpdateTime;
          const diffMinutes = Math.floor(diffTime / 60000);
          const diffSeconds = Math.floor((diffTime % 60000) / 1000);

          document.querySelector(
            "label p"
          ).innerHTML = `Mark Given at → ${lastUpdateTime.toLocaleTimeString()} - ${diffMinutes} Minutes ${diffSeconds} Seconds ago ...`;

          const allP = document.getElementsByClassName("markSuggestions");
          for (const p of allP) {
            markBox.parentNode.removeChild(p);
          }
          const markSuggestion = document.createElement("p");
          markSuggestion.className = "m-2 w-50 markSuggestions";
          markSuggestion.innerText = `${data.mark007}/${data.totalMark007}`;
          markBox.after(markSuggestion);

          alert("Set Total Mark Correctly and Read the feedback properly");
        } else {
          textArea.innerHTML = `<h1>Wrong feedback. Check the Assignment!...</h1>`;
        }
      })
      .catch((err) => console.error(err));
  }
});
