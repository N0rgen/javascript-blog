const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
}

'use strict';
/*document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
}); */

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');


  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);


  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors',
  optAuthorCloudClassPrefix = 'author-size-';


function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);


  let html = '';
  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);


    /* insert link into titleList */
    html = html + linkHTML;

  }
  titleList.innerHTML = html;

  addClickListenersToTitles();

  addClickListenersToTags();
  addClickListenersToAuthor();
}

generateTitleLinks();
const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}

function calculateTagsParams(tags) {
  const params = {min: 999999, max: 0};

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount -1) +1);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const articleTags = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    /* split tags into array */
    const tagsArray = tags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of tagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    articleTags.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagClass = calculateTagClass(allTags[tag], tagsParams);
    const tagLinkHtml = `<li><a href="#tag-${tag}" class="${tagClass}">${tag}</a></li>`;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTags = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of allTags){
    /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorParams(authors) {
  const params = {min: 999999, max: 0};

  for(let author in authors){
    if(authors[author] > params.max){
      params.max = authors[author];
    }
    if(authors[author] < params.min){
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount -1) +1);
  return optAuthorCloudClassPrefix + classNumber;
}

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
    const articleAuthor = article.querySelector(optArticleAuthorSelector);
    let html = "";
    const author = article.getAttribute('data-author');

    const linkHTMLData = {author: author};
    const linkHTML = templates.authorLink(linkHTMLData);
    html = linkHTML;

    if(!allAuthors[author]){
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    articleAuthor.innerHTML = html;
  }

  const authorList = document.querySelector(optAuthorsListSelector);
  const authorParams = calculateAuthorParams(allAuthors);
  const allAuthorsData = {authors: []};


  for(let author in allAuthors){
    const authorClass = calculateAuthorClass(allAuthors[author], authorParams);
    const authorLinkHtml = `<li><a href="#author-${author}" class="${authorClass}">${author} (${allAuthors[author]})</a></li>`;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className: calculateAuthorClass(allAuthors[author], authorParams)
    });
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();

function authorClickHandler (event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for(let activeAuthor of activeAuthors){
    activeAuthor.classList.remove('active');
  }
  const allAuthors = document.querySelectorAll('a[href="' + href + '"]');
  for(let authorLink of allAuthors){
    authorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthor(){
  const authorsLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of authorsLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthor();

function addClickListenersToTitles(){
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
