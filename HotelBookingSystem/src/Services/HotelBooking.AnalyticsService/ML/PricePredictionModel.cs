using System;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace HotelBooking.AnalyticsService.ML
{
    public class PricePredictionModel
    {
        // Define the input data class
        public class PricePredictionInput
        {
            public string RoomType { get; set; }
            public int NumberOfGuests { get; set; }
            public DateTime CheckInDate { get; set; }
            public DateTime CheckOutDate { get; set; }
        }

        // Define the output data class
        public class PricePredictionOutput
        {
            [ColumnName("Score")]
            public float PredictedPrice { get; set; }
        }

        private readonly MLContext _mlContext;
        private ITransformer _model;

        public PricePredictionModel()
        {
            _mlContext = new MLContext();
            LoadModel();
        }

        private void LoadModel()
        {
            // Load the trained model from file
            _model = _mlContext.Model.Load("path/to/your/model.zip", out var modelInputSchema);
        }

        public float PredictPrice(PricePredictionInput input)
        {
            var predictionEngine = _mlContext.Model.CreatePredictionEngine<PricePredictionInput, PricePredictionOutput>(_model);
            var result = predictionEngine.Predict(input);
            return result.PredictedPrice;
        }
    }
}