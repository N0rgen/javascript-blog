
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
  optArticleAuthorSelector = '.post-author';


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
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      

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

function generateTags() {
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
      const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;

      /* add generated code to html variable */
      html = html + linkHTML;

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    articleTags.innerHTML = html

  /* END LOOP: for every article: */
  }
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

function generateAuthors(){
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
    const articleAuthor = article.querySelector(optArticleAuthorSelector);
    let html = "";
    const author = article.getAttribute('data-author');    
    const linkHTML = `<a href="#author-${author}">${author}</a>`;
    html = linkHTML;
    articleAuthor.innerHTML = html;
  }
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