import { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import _ from "underscore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { API_BASE_URL } from "../recoil/constants";

const IMAGE_LIST_URL = `${API_BASE_URL}/images`;

export class ImageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      images: [],
    };
  }
  componentDidMount() {
    this.fetchImages();
    //     this.timer = setInterval(() => this.fetchImages(), 5000);
  }

  fetchImages = () => {
    this.setState({ ...this.state, isFetching: true });
    fetch(IMAGE_LIST_URL)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({ images: result, isFetching: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ ...this.state, isFetching: false });
      });
  };

  rowClassNameFormat(row, rowIdx) {
    return rowIdx % 2 === 0 ? "Gold-Row" : "Silver-Row";
  }

  render() {
    const images = _.map(this.state.images, (image, index) => (
      <Draggable key={image.path} draggableId={image.path} index={index}>
        {(provided) => (
          <li>
            <img
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              class="a-list-image"
              alt={image.img.replace(/.png|.gif|.jpg/g, "")}
              src={`${API_BASE_URL}${image.path}`}
            />
          </li>
        )}
      </Draggable>
    ));
    const rValue = (
      <DragDropContext>
        <Droppable droppableId="a-list">
          {(provided) => (
            <ul
              class="a-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {images}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
    return rValue;
  }
}

export default ImageTable;
