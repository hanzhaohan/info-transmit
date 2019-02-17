import marked from 'marked'

let renderMD = new marked.Renderer();

let index = 0;
renderMD.heading = function (text, level) {
    return `<h${level} class="my-blog-head" id="my-blog-head${index++}">${text}</h${level}>`
}

marked.setOptions({
    renderer: renderMD,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
});
export default function markdown (str) {
    console.log(marked(str));
    return marked(str);
}
