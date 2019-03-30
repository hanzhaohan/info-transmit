let treeify=function(data){
    let tree = [];
    let firCode = data[0].Code;
    let firLen = firCode.length;
    let firH = firLen/3;
    data.forEach(function(item,index){
      item.children = [];
      let h = item.Code.length/3;
      if(h==firH){
        tree.push(item);
      }else{
        let idx = item.Code.charAt(firLen-1);
        tree[idx-1].children.push(item);
      }
    })
    tree.forEach(function(child){
      let childArr = child.children;
      let ids = 0;
      let firL = data[0].Code.length;
      childArr.forEach(function(childitem){
        if(childitem.Code.length > firL){
          ids = 1;
        }
      })
      if (ids == 1) {
        child.children = treeify(childArr)
      }
    })
    return tree;
  }

  export default treeify;