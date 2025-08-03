using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using HotelBooking.AnalyticsService.Services;
using HotelBooking.Models.DTOs;

namespace HotelBooking.AnalyticsService.Tests.Services
{
    public class ReportServiceTests
    {
        private readonly Mock<IReportRepository> _reportRepositoryMock;
        private readonly ReportService _reportService;

        public ReportServiceTests()
        {
            _reportRepositoryMock = new Mock<IReportRepository>();
            _reportService = new ReportService(_reportRepositoryMock.Object);
        }

        [Fact]
        public async Task GenerateWeeklyReport_ShouldReturnReport_WhenCalled()
        {
            // Arrange
            var expectedReport = new ReportDto
            {
                ReportType = "Weekly",
                ReportData = new List<BookingDto>
                {
                    new BookingDto { BookingId = Guid.NewGuid(), TotalAmount = 100.00M }
                }
            };

            _reportRepositoryMock.Setup(repo => repo.GetWeeklyReportAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(expectedReport);

            // Act
            var result = await _reportService.GenerateWeeklyReport(DateTime.UtcNow.AddDays(-7), DateTime.UtcNow);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedReport.ReportType, result.ReportType);
            Assert.Equal(expectedReport.ReportData.Count, result.ReportData.Count);
        }

        [Fact]
        public async Task GenerateMonthlyReport_ShouldReturnReport_WhenCalled()
        {
            // Arrange
            var expectedReport = new ReportDto
            {
                ReportType = "Monthly",
                ReportData = new List<BookingDto>
                {
                    new BookingDto { BookingId = Guid.NewGuid(), TotalAmount = 500.00M }
                }
            };

            _reportRepositoryMock.Setup(repo => repo.GetMonthlyReportAsync(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(expectedReport);

            // Act
            var result = await _reportService.GenerateMonthlyReport(DateTime.UtcNow.Year, DateTime.UtcNow.Month);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedReport.ReportType, result.ReportType);
            Assert.Equal(expectedReport.ReportData.Count, result.ReportData.Count);
        }

        [Fact]
        public async Task GenerateCustomReport_ShouldReturnReport_WhenCalled()
        {
            // Arrange
            var expectedReport = new ReportDto
            {
                ReportType = "Custom",
                ReportData = new List<BookingDto>
                {
                    new BookingDto { BookingId = Guid.NewGuid(), TotalAmount = 300.00M }
                }
            };

            _reportRepositoryMock.Setup(repo => repo.GetCustomReportAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<List<string>>()))
                .ReturnsAsync(expectedReport);

            // Act
            var result = await _reportService.GenerateCustomReport(DateTime.UtcNow.AddMonths(-1), DateTime.UtcNow, new List<string> { "Standard", "Deluxe" });

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedReport.ReportType, result.ReportType);
            Assert.Equal(expectedReport.ReportData.Count, result.ReportData.Count);
        }
    }
}