
var games;
var edges;
var sg;
var gData;
var highlightLinks = [];

init("results/simple_AE_2d_11_degree/pro_nodes.csv","results/simple_AE_2d_11_degree/pro_edges.csv");
var x = document.getElementById("right-float");
var y = document.getElementById("bottom-float");
var z = document.getElementById("left-float");
x.style.display = "none";
y.style.display = "none";
z.style.display = "none";
var colorList = [
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24)),
    Math.round(Math.random() * Math.pow(2, 24))
]


function init(nodes, edges) {
    let select = document.getElementById("gselect");
    select.addEventListener("change", onSelectChanged);
    d3.csv(nodes).then(function(data){
        games = data;
    });

    d3.csv(edges).then(function(data) {
        edges = data;
        // console.log(games);
        // console.log(edges);
        gData = {
            nodes: games,
            links: edges
        };

        highlightLinks = [];
        // let highlightNodes = [];
        loadImage3DGraph();

    });
}

function refreshHTML(node) {
    document.getElementById("poster").src = "img/"+node.id+".jpg";
    document.getElementById("name").innerHTML = node.Name + "(id:"+node.id+")";
    // document.getElementById("tid").innerHTML = node.id;
    // document.getElementById("tname").innerHTML = node.Name;
    document.getElementById("tprice").innerHTML = node.price;
    document.getElementById("tcompany").innerHTML = node.company;
    document.getElementById("tyear").innerHTML = node.date;
    document.getElementById("trating").innerHTML = node.Rating;
    document.getElementById("link").href = "https://steamdb.info/app/"+node.id+"/info/"
}

function leftClick(node) {
    document.getElementById("cluster").innerHTML = "Cluster " + node.group;
    refreshHTML(node);
    var counter = 0;
    var imgs = "";
    var rows = "";
    for (member of gData.nodes) {
        if (member.group == node.group) {
            // members.push(member);
            imgs += posterFormat(member.id);
            rows += tbodyFormat(member);
            counter++;
        }
    }

    document.getElementById("member").innerHTML = "All members(" + counter + "):"
    document.getElementById("members").innerHTML = imgs;
    document.getElementById("mrows").innerHTML = rows;
}

function rightClick(node) {
    refreshHTML(node);
    var counter = 0;
    highlightLinks = [];
    let neighbors = [];
    var imgs = "";
    for (link of gData.links) {
        if (link.source.id==node.id) {
            highlightLinks.push(link);
            counter++;
            neighbors.push(link.target);
        }
        if (link.target.id==node.id) {
            highlightLinks.push(link);
            counter++;
            neighbors.push(link.source);
            // console.log(link);
        }
    }
    // document.getElementById("talltime").innerHTML = counter;
    for (neigh of neighbors) {
        imgs += posterFormat(neigh.id);
    }
    document.getElementById("neighbors").innerHTML = imgs;
    // console.log(highlightLinks);
    updateGeometries();
}

function loadImage3DGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ id }) => {
        // use a sphere as a drag handle
        const obj = new THREE.Mesh(
          new THREE.SphereGeometry(7),
          new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
        );

        // add img sprite as child
        const imgTexture = new THREE.TextureLoader().load(`img/${id}.jpg`);
        // const imgTexture = new THREE.TextureLoader().load(`https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`);
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(25, 12);

        obj.add(sprite);

        return obj;
      })
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
  sg = Graph;
}

function loadGroup3DGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeAutoColorBy('group')
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadPriceGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ price, group }) => new THREE.Mesh(
          new THREE.SphereGeometry((price+1)/8),
          new THREE.MeshLambertMaterial({
            color: colorList[group%10],
            transparent: false,
            opacity: 0.99
          })
      ))
      .nodeAutoColorBy('group')
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadSeriesGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeAutoColorBy('ser_id')
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadYearGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ date, group }) => new THREE.Mesh(
          new THREE.SphereGeometry((date-1997)/3),
          new THREE.MeshLambertMaterial({
            color: colorList[group%10],
            transparent: false,
            opacity: 0.99
          })
      ))
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadYearSeriesGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ date, ser_id }) => new THREE.Mesh(
          new THREE.SphereGeometry((date-1997)/3),
          new THREE.MeshLambertMaterial({
            color: colorList[ser_id%7],
            transparent: false,
            opacity: 0.99
          })
      ))
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadPriceSeriesGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ price, ser_id }) => new THREE.Mesh(
          new THREE.SphereGeometry((price+1)/10),
          new THREE.MeshLambertMaterial({
            color: colorList[ser_id%7],
            transparent: false,
            opacity: 0.99
          })
      ))
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadRatingGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ Rating, group }) => new THREE.Mesh(
          new THREE.SphereGeometry(Rating*5),
          new THREE.MeshLambertMaterial({
            color: colorList[group%10],
            transparent: false,
            opacity: 0.99
          })
      ))
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadTagGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeAutoColorBy('tag')
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function loadSaleGraph() {
    const Graph = ForceGraph3D()
      (document.getElementById('3d-graph'))
      .nodeThreeObject(({ discount, group }) => new THREE.Mesh(
          [
              new THREE.SphereGeometry(2),
              new THREE.BoxGeometry(10,10,10)
          ]
          [Math.round(discount)],
          new THREE.MeshLambertMaterial({
            color: colorList[group%10],
            transparent: false,
            opacity: 0.99
          })
      ))
      .linkWidth(link => highlightLinks.indexOf(link) === -1 ? 0.3 : 0.8)
      .linkColor(link => highlightLinks.indexOf(link) === -1 ? 'white' : 'red')
      .linkOpacity(0.3)
      .graphData(gData)
      .nodeLabel('Name')
      .onNodeClick(node => {
          leftClick(node);
      })
      .onNodeRightClick(node => {
          rightClick(node);
      });
      sg = Graph;
}

function onSelectChanged() {
    var e = document.getElementById("gselect");
    var value = e.options[e.selectedIndex].value;
    var text = e.options[e.selectedIndex].text;
    document.getElementById("gtype").innerHTML = text;
    if (value == "1"){
        loadImage3DGraph();
    } else if (value == "2") {
        loadGroup3DGraph();
    } else if (value == "3") {
        loadPriceGraph();
    } else if (value == "4") {
        loadYearGraph();
    } else if (value == "5") {
        loadSeriesGraph();
    } else if (value == "6") {
        loadPriceSeriesGraph();
    } else if (value == "7") {
        loadYearSeriesGraph();
    } else if (value == "8") {
        loadRatingGraph();
    } else if (value == "9") {
        loadTagGraph();
    } else if (value == "10") {
        loadSaleGraph();
    }
}

function updateGeometries() {
  sg.nodeRelSize(4); // trigger update of 3d objects in scene
}

function posterFormat(id) {
  return "<a id=\"link\" href=\"https://steamdb.info/app/"+id+"/info/\" target=\"_blank\"><img class=\"info\" src=\"img/"+id+".jpg\" style=\"width:100%; \"></a>";
}

function tbodyFormat(node) {
  return "<tr class=\"row100 body\"><td class=\"cell100 column1\">"
  + node.id+"</td><td class=\"cell100 column2\">"
  + node.Name+"</td><td class=\"cell100 column3\">"
  + node.price+"</td><td class=\"cell100 column4\">"
  + node.company+"</td><td class=\"cell100 column5\">"
  + node.date+"</td><td class=\"cell100 column6\">"
  + node.Rating+"</td></tr>"
}

function openNavRight() {
  var x = document.getElementById("right-float");
  var y = document.getElementById("bottom-float");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "block";
  } else {
    x.style.display = "none";
    y.style.display = "none";
  }
}

function openNavLeft() {
  var x = document.getElementById("left-float");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function searchGame() {
    var id=document.getElementById("searchbar").value;
    // console.log();
    var found = false;
    for (node of gData.nodes) {
        if (node.id == id) {
            const distance = 40;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

            sg.cameraPosition(
              { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
              node, // lookAt ({ x, y, z })
              3000  // ms transition duration
            );
            found = true;
            break;
        }
    }
    if (!found) {
        alert("Game not found! Check your AppID");
    }

}
