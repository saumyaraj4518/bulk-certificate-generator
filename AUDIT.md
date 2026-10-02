# GDG AITR Website -- Review & Suggestions

I checked the GDG AITR website on both desktop and mobile. Overall, the
website has a clean design and the content is easy to understand. While
checking the pages, I noticed some areas where the UI and user
experience can be improved.

## 1. Mobile spacing can be improved

**Problem:**\
On mobile, some sections have more empty space than required. There is a
noticeable gap between some of the content sections.

**Solution:**\
Reduce unnecessary padding and margins on smaller screens and adjust the
spacing between sections.

**How I would apply it:**\
I would use CSS media queries to reduce the spacing for mobile devices.

``` css
@media (max-width: 768px) {
  .section {
    padding: 40px 20px;
  }

  .section-title {
    margin-bottom: 20px;
  }
}
```

This would make the page more compact and reduce unnecessary scrolling.

------------------------------------------------------------------------

## 2. Past event is shown on the homepage

**Problem:**\
The featured event shown in the screenshot is marked as **"Past Event"**
and **"Closed."** Showing a completed event prominently may confuse a
new visitor.

**Solution:**\
Show upcoming events first and keep past events separately.

**How I would apply it:**\
I would store the events in a JavaScript array and compare their dates
with the current date.

``` javascript
const events = [
  {
    title: "Web Development Workshop",
    date: "2026-10-10",
    status: "upcoming"
  },
  {
    title: "Portfolio Workshop",
    date: "2026-09-21",
    status: "past"
  }
];

const upcomingEvents = events.filter(
  event => new Date(event.date) >= new Date()
);
```

This can be implemented using HTML, CSS and JavaScript without requiring
a backend.

------------------------------------------------------------------------

## 3. Mobile navigation can be improved

**Problem:**\
On mobile, the website uses a hamburger menu. The approach is good, but
the navigation could be made easier to use.

**Solution:**\
Keep the hamburger menu but make the menu links clearly grouped and easy
to access.

**How I would apply it:**

``` html
<button id="menuBtn">☰</button>

<nav id="mobileMenu">
  <a href="#home">Home</a>
  <a href="#events">Events</a>
  <a href="#team">Team</a>
  <a href="#projects">Projects</a>
  <a href="#contact">Contact</a>
</nav>
```

``` javascript
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});
```

CSS can then control the visibility and animation of the menu.

------------------------------------------------------------------------

## 4. Student projects could be showcased

**Problem:**\
The website shows GDG activities and technical tracks, but students'
actual projects aren't very visible.

**Solution:**\
Add a **Student Projects** section.

**How I would apply it:**\
Create project cards in HTML and use JavaScript for filtering.

``` html
<div class="project-card" data-category="web">
  <h3>AI Study Assistant</h3>
  <p>Web application for helping students study.</p>
  <span>JavaScript</span>
  <a href="#">GitHub</a>
</div>
```

Possible filters:

`All | Web | AI | Android | Cloud`

JavaScript can show or hide cards based on the selected category.

------------------------------------------------------------------------

## 5. Event information could be easier to scan

**Problem:**\
The event cards contain date, time, venue and seat information, but some
of this information is relatively small.

**Solution:**\
Make important event details visually clearer.

**How I would apply it:**

``` html
<div class="event-info">
  <span>📅 21 Sept 2026</span>
  <span>🕐 10:00 AM</span>
  <span>📍 Lab 116</span>
</div>
```

``` css
.event-info {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 14px;
}
```

On mobile, the items can automatically wrap onto multiple lines.

------------------------------------------------------------------------

## 6. Some text is small on mobile

**Problem:**\
Some secondary text, especially descriptions and footer information,
looks quite small on mobile.

**Solution:**\
Increase readability on smaller screens.

**How I would apply it:**

``` css
.description {
  font-size: 16px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .description {
    font-size: 15px;
    line-height: 1.6;
  }
}
```

I would also check the contrast between text and background.

------------------------------------------------------------------------

## 7. Footer is long on mobile

**Problem:**\
The footer contains many useful links, but on mobile it becomes a long
vertical section.

**Solution:**\
Group related links and make them collapsible on mobile.

**How I would apply it:**\
Use HTML for the groups and JavaScript to toggle the links.

``` javascript
heading.addEventListener("click", () => {
  links.classList.toggle("show");
});
```

This keeps the footer more compact on mobile.

------------------------------------------------------------------------

# Feature Suggestions

## 8. Latest Announcements section

**Problem:**\
Important announcements may not immediately catch the user's attention.

**Solution:**\
Add a small **Latest Announcements** section near the events.

**How I would apply it:**

``` html
<div class="announcement">
  <span>📢</span>
  <div>
    <h3>Workshop Registration Open</h3>
    <p>Registration is open for the upcoming workshop.</p>
  </div>
</div>
```

JavaScript can later be used to rotate or filter announcements.

------------------------------------------------------------------------

## 9. Workshop Resources

**Problem:**\
After a workshop, students who missed it may not have an easy way to
find its resources.

**Solution:**\
Add resource links to completed event cards.

**How I would apply it:**

``` html
<div class="resources">
  <a href="#">📄 Slides</a>
  <a href="#">💻 GitHub</a>
  <a href="#">📚 Resources</a>
</div>
```

This can initially be implemented with normal HTML links.

------------------------------------------------------------------------

## 10. Event Archive

**Problem:**\
Past events are useful, but they shouldn't take priority over upcoming
events.

**Solution:**\
Create a separate **Past Events** section.

**How I would apply it:**

``` javascript
const pastEvents = events.filter(
  event => new Date(event.date) < new Date()
);
```

Then display them under an Event Archive section.

------------------------------------------------------------------------

# A Concept I Can Actually Implement

## Interactive Event & Project Section

Instead of making the website only static, I would add small JavaScript
interactions.

**Events:** `All | Upcoming | Past`

**Projects:** `All | Web | AI | Android`

For example:

``` javascript
function filterProjects(category) {
  const projects = document.querySelectorAll(".project-card");

  projects.forEach(project => {
    if (
      category === "all" ||
      project.dataset.category === category
    ) {
      project.style.display = "block";
    } else {
      project.style.display = "none";
    }
  });
}
```

**Technologies required:**

-   HTML → structure
-   CSS → responsive design and animations
-   JavaScript → filtering, menus and interactions

These suggestions are intentionally limited to things that can be
implemented with HTML, CSS and JavaScript.
