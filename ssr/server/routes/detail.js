import { Router } from "express";
import { getMovieDetail, getPopular } from "../services/movie.js";
import { renderMovieItemPage } from "./index.js";

const router = Router();

const renderMovieDetailItem = ({
  title,
  releaseYear,
  genres,
  description,
  thumbnail,
}) => {
  return /*html*/ `
  <div class="modal-background active" id="modalBackground">
    <div class="modal">
    <button class="close-modal" id="closeModal"><img src="../assets/images/modal_button_close.png" /></button>
    <div class="modal-container">
      <div class="modal-image">
        <img src="https://image.tmdb.org/t/p/original/${thumbnail}.jpg" />
      </div>
      <div class="modal-description">
        <h2>${title}</h2>
        <p class="category">${releaseYear} · ${genres.join(", ")}</p>
        <p class="rate"><img src="../assets/images/star_filled.png" class="star" /><span>7.7</span></p>
        <hr />
        <p class="detail">
          ${description}
        </p>
      </div>
    </div>
  </div>
</div>
<!-- 모달 창 닫기 스크립트 -->
<script>
  const modalBackground = document.getElementById("modalBackground");
  const closeModal = document.getElementById("closeModal");
  document.addEventListener("DOMContentLoaded", () => {
    closeModal.addEventListener("click", () => {
      modalBackground.classList.remove("active");
    });
  });
</script>
`;
};

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const movieDetail = await getMovieDetail(id);

  const movieItems = await getPopular();
  const moviesPageTemplate = renderMovieItemPage(movieItems);
  const renderedHTML = moviesPageTemplate.replace(
    "<!--${MODAL_AREA}-->",
    renderMovieDetailItem(movieDetail)
  );

  res.send(renderedHTML);
});

export default router;
