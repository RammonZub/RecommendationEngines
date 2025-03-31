# Restaurant Recommendation System

![Restaurant Recommender App](https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg)

## Overview

This project implements a sophisticated restaurant recommendation system based on machine learning algorithms and user preferences. It consists of two main components:

1. **Data Science Models**: A comprehensive suite of recommendation algorithms built and evaluated using the Yelp dataset, focusing on restaurant recommendations.
2. **Web Application**: A modern, interactive frontend that demonstrates the recommendation algorithms in action, allowing users to discover restaurants based on various criteria.

## Project Structure

```
.
├── Recommendation_Models/        # ML recommendation models
│   ├── data/                     # Dataset files 
│   │   ├── yelp_academic_dataset_*.csv    # Raw Yelp datasets
│   │   ├── small_reviews.csv     # Preprocessed smaller dataset of reviews
│   │   ├── restaurants.csv       # Filtered dataset containing only restaurants
│   │   ├── trainset.csv          # Preprocessed training dataset
│   │   ├── testset.csv           # Preprocessed testing dataset
│   │   └── restaurants_train.csv # Filtered restaurant data for training
│   └── group_project.ipynb       # Main notebook with all recommendation algorithms
├── webapp/                       # Interactive frontend application
│   ├── src/                      # Source code
│   │   ├── app/                  # Next.js app directory
│   │   ├── components/           # React components
│   │   ├── context/              # Context providers
│   │   └── services/             # API services
│   ├── public/                   # Static assets
│   └── package.json              # Dependencies
└── README.md                     # This file
```

## Data Science Implementation

We developed a diverse set of recommendation engines for TheFork, a leading restaurant app. Starting with a Yelp dataset filtered for restaurants, we implemented and evaluated these approaches:

### Dataset Information

The `/data` directory contains both raw and preprocessed datasets:
- The files named `yelp_academic_dataset_*.csv` are the original Yelp datasets
- Files without the `yelp_academic_dataset` prefix (such as `small_reviews.csv`, `restaurants.csv`, `trainset.csv`, etc.) are preprocessed datasets created during our data preparation phase to make the models more efficient and focused on restaurant recommendations

### Implemented Algorithms

1. **Non-personalized Recommenders**
   - Random recommender (baseline)
   - Popularity-based recommender

2. **Collaborative Filtering**
   - Item-based collaborative filtering
   - User-based collaborative filtering
   - Model-based (SVD) collaborative filtering

3. **Content-based Recommenders**
   - TF-IDF based on restaurant descriptions and categories

4. **Hybrid Recommenders**
   - Weighted hybrid combining collaborative and content-based methods
   - Switching hybrid that selects the best algorithm based on context

5. **Context-aware Recommenders**
   - Recommendations based on time, location, and user situation

6. **Advanced Models**
   - LightFM (combining collaborative and content-based in one model)
   - Ensemble recommender combining multiple algorithms
   - Bandit algorithms addressing the exploration-exploitation trade-off

### Evaluation Methods

We employed diverse metrics beyond simple accuracy:
- Regression metrics (RMSE, MAE)
- Classification metrics (precision, recall)
- Business-oriented metrics (coverage, diversity)


## Web Application

The web application demonstrates the recommendation algorithms in action with a modern, responsive user interface built with Next.js and React.

### Features

- **Authentication System**: Users can sign up, login, and maintain profiles with their preferences
- **Personalized Recommendations**: Authenticated users receive tailored restaurant suggestions
- **Default Recommendations**: Non-authenticated users see popular restaurants
- **Interactive Filtering**: Users can filter recommendations by cuisine, location, price range, and more
- **Restaurant Details**: Comprehensive information about each restaurant including ratings, reviews, and location
- **Responsive Design**: Optimized for all devices from mobile to desktop

### Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Headless UI, Heroicons
- **Map Integration**: Leaflet for interactive maps
- **Authentication**: JWT-based authentication

### Run the Application

#### Frontend

```bash
cd webapp
npm install
npm run dev
```

The application will be available at http://localhost:3000

## Getting Started with the Models

To explore the recommendation models:

1. Clone this repository
2. Set up your Python environment:
   ```bash
   pip install numpy pandas matplotlib seaborn scikit-learn scikit-surprise lightfm
   ```
3. Open the Jupyter notebook:
   ```bash
   cd Recommendation_Models
   jupyter notebook group_project.ipynb
   ```


## Contributors

- Giacomo, Simao, Duarte, Paolo and Ramon