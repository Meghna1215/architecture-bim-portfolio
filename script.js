document.documentElement.classList.add('js');
window.addEventListener('DOMContentLoaded',()=>{
  requestAnimationFrame(()=>document.body.classList.add('loaded'));
  const chapters=[...document.querySelectorAll('.capability')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting)),{threshold:.18});
    chapters.forEach(chapter=>observer.observe(chapter));
  }else{chapters.forEach(chapter=>chapter.classList.add('is-visible'))}
});
