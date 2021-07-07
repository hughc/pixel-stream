
import { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';


const API_BASE_URL = 'http://localhost:3001';
const IMAGE_LIST_URL = `${API_BASE_URL}/images`;

export class ImageTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      images: []
    };
  }
  componentDidMount() {
    this.fetchImages();
//     this.timer = setInterval(() => this.fetchImages(), 5000);
  }

  fetchImages = () => {

    
    this.setState({ ...this.state, isFetching: true });
    fetch(IMAGE_LIST_URL)
      .then(response => {return response.json()})
      .then(result => {
        this.setState({ images: result, isFetching: false })
      })
      .catch(e => {
        console.log(e);
        debugger;
        this.setState({ ...this.state, isFetching: false });
      });
  };

  rowClassNameFormat(row, rowIdx) {
    return rowIdx % 2 === 0 ? 'Gold-Row' : 'Silver-Row';
  }

  render() {
    const columns = [{
      dataField: 'path',
      text: 'preview',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <div>
          <img class='a-list-image' src={`${API_BASE_URL}${cell}`} />
          <div class='a-list-title'>{row.img.replace(/.png|.gif|.jpg/g, '')}</div>
        </div>;
      }
    }, {
      dataField: 'img',
      text: 'Image'
    }];
    
    return (
      <div>
      <BootstrapTable data={this.state.images} keyField='img' columns = {columns}/>
        <p>{this.state.isFetching ? 'Fetching images...' : ''}</p>
        <p>{!this.state.isFetching ? 'not fetching' : ''}</p>
      </div>
    )
  }


}

export default ImageTable;
