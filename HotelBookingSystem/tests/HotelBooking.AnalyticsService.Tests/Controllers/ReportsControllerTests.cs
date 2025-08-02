using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using HotelBooking.AnalyticsService.Controllers;
using HotelBooking.AnalyticsService.Services;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Tests.Controllers
{
    public class ReportsControllerTests
    {
        private readonly ReportsController _controller;
        private readonly Mock<IReportService> _mockReportService;

        public ReportsControllerTests()
        {
            _mockReportService = new Mock<IReportService>();
            _controller = new ReportsController(_mockReportService.Object);
        }

        [Fact]
        public async Task GetWeeklyReport_ReturnsOkResult_WhenReportExists()
        {
            // Arrange
            var startDate = new DateTime(2024, 3, 1);
            var endDate = new DateTime(2024, 3, 7);
            var report = new ReportDto { ReportType = "Weekly", Data = "Sample Data" };
            _mockReportService.Setup(service => service.GetWeeklyReport(startDate, endDate))
                .ReturnsAsync(report);

            // Act
            var result = await _controller.GetWeeklyReport(startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ReportDto>(okResult.Value);
            Assert.Equal(report.Data, returnValue.Data);
        }

        [Fact]
        public async Task GetWeeklyReport_ReturnsNotFound_WhenReportDoesNotExist()
        {
            // Arrange
            var startDate = new DateTime(2024, 3, 1);
            var endDate = new DateTime(2024, 3, 7);
            _mockReportService.Setup(service => service.GetWeeklyReport(startDate, endDate))
                .ReturnsAsync((ReportDto)null);

            // Act
            var result = await _controller.GetWeeklyReport(startDate, endDate);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GenerateCustomReport_ReturnsCreatedResult_WhenReportIsGenerated()
        {
            // Arrange
            var reportRequest = new CustomReportRequestDto { ReportType = "Revenue Analysis", StartDate = new DateTime(2024, 1, 1), EndDate = new DateTime(2024, 3, 31) };
            _mockReportService.Setup(service => service.GenerateCustomReport(reportRequest))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.GenerateCustomReport(reportRequest);

            // Assert
            var createdResult = Assert.IsType<CreatedResult>(result);
            Assert.Equal((int)HttpStatusCode.Created, createdResult.StatusCode);
        }

        [Fact]
        public async Task GenerateCustomReport_ReturnsBadRequest_WhenReportGenerationFails()
        {
            // Arrange
            var reportRequest = new CustomReportRequestDto { ReportType = "Revenue Analysis", StartDate = new DateTime(2024, 1, 1), EndDate = new DateTime(2024, 3, 31) };
            _mockReportService.Setup(service => service.GenerateCustomReport(reportRequest))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.GenerateCustomReport(reportRequest);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }
    }
}