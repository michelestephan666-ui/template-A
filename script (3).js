const enterButton = document.getElementById("enterButton");
const opening = document.getElementById("opening");
const music = document.getElementById("music");
const form = document.getElementById("rsvpForm");
const success = document.getElementById("success");
/* =================================
   GOOGLE FORM CONNECTION
   Replace these 5 values with your
   own form's URL and entry IDs
   (see the setup steps you were given).
================================= */
const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdoTq0g6MoXtMZKcpXcGDpXIj1YC-G5mG5jrV8IT2II7b54IA/formResponse";
const GOOGLE_FORM_FIELDS = {
    name: "entry.1135046011",
    attendance: "entry.2134531345",
    guests: "entry.1420302605",
    message: "entry.361798693"
};
/* =================================
   PERSONALIZED GUEST LINK
   Reads ?guest=... from the URL and
   displays it exactly as written after
   "Dear " — nothing is added
   automatically, so you decide per
   link whether it says a name, a
   couple, or a family.
   Use a hyphen instead of spaces.
   Examples:
     ?guest=Elie              -> "Dear Elie"
     ?guest=Vanessa-and-Abbas -> "Dear Vanessa and Abbas"
     ?guest=Khoury-Family     -> "Dear Khoury Family"
   (?family=... still works too, for
   any links you already sent out.)
================================= */
const urlParams = new URLSearchParams(window.location.search);
const rawGuest = urlParams.get("guest") || urlParams.get("family");
const guestName = rawGuest
    ? rawGuest.replace(/-/g, " ").trim()
    : "";
const guestNameEl = document.getElementById("guestName");
if (guestName && guestNameEl) {
    guestNameEl.textContent = "Dear " + guestName;
    guestNameEl.classList.add("show");
}
/* =================================
   OPEN INVITATION
================================= */
enterButton.addEventListener("click", function () {
    // Start music after user interaction.
    music.volume = 0.3;
    music.play().catch(() => {
        console.log("Music could not start.");
    });
    // Fade the opening away.
    opening.classList.add("hide");
    // Move the visitor to the invitation.
    setTimeout(() => {
        document
            .getElementById("invitation")
            .scrollIntoView({
                behavior: "smooth"
            });
    }, 1200);
});
/* =================================
   RSVP
================================= */
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // The guest name comes from the invite link,
    // not from a typed field.
    const name = guestName || "Guest";
    const attendance =
        document.querySelector(
            'input[name="attendance"]:checked'
        ).value;
    const guests =
        document.getElementById("guests").value;
    const message =
        document.getElementById("message").value;
    const response = {
        name: name,
        attendance: attendance,
        guests: guests,
        message: message
    };
    console.log("RSVP received:", response);
    // Send the response to the Google Form,
    // which drops it as a new row in your
    // linked Google Sheet.
    const formData = new FormData();
    formData.append(GOOGLE_FORM_FIELDS.name, name);
    formData.append(GOOGLE_FORM_FIELDS.attendance, attendance);
    formData.append(GOOGLE_FORM_FIELDS.guests, guests);
    formData.append(GOOGLE_FORM_FIELDS.message, message);
    /*
        Google Forms doesn't allow the browser to
        read its response (CORS), so this is a
        "fire and forget" submission using no-cors.
        The row still lands in your spreadsheet even
        though JS can't confirm it here — this only
        catches network-level failures, not Google's
        actual response.
    */
    fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    }).catch(() => {
        console.log("Could not reach the Google Form.");
    });
    // Hide the form.
    form.style.display = "none";
    // Show confirmation.
    success.classList.add("show");
});
/* =================================
   VINTAGE PHOTO REVEAL
================================= */
const postcardPhoto = document.querySelector(".postcard-photo");
const postcardQuote = document.querySelector(".postcard-quote");
if (postcardPhoto && postcardQuote) {
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                }
            });
        },
        { threshold: 0.35 }
    );
    revealObserver.observe(postcardPhoto);
    revealObserver.observe(postcardQuote);
    // Once the entrance settles, start the gentle floating drift.
    postcardPhoto.addEventListener("transitionend", function (event) {
        if (event.propertyName === "transform") {
            postcardPhoto.classList.add("settled");
        }
    });
}