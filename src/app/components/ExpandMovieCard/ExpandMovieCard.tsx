import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const IMAGE_PATH = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/`
const MAX_LENGTH = 50

/** */
function truncateString(s: string, maxLength: number = 50): string {
    return s.length > maxLength ? `${s.substring(0, maxLength - 3)}...` : s;
}

export default function ExMovieCard({
    movie
}:{
    movie: any
}) {
    const overView = truncateString(movie.overview)
  return (
    <Card sx={{ width: 280 }}>
      <CardMedia
        sx={{ height: 360 }}
        image={`${IMAGE_PATH}${movie.poster_path}`}
        title={movie.original_title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {movie.original_title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {overView}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}